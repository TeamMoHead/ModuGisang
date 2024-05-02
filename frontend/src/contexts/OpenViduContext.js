import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import { UserContext, ChallengeContext } from './';
import { challengeServices } from '../apis';
import { OpenVidu } from 'openvidu-browser';

const OpenViduContext = createContext();

const OpenViduContextProvider = ({ children }) => {
  const { userInfo } = useContext(UserContext);
  const { challengeData } = useContext(ChallengeContext);
  const { userId, userName } = userInfo;

  // ------ openvidu 관련 state --------
  const [videoSession, setVideoSession] = useState(null);
  const [connectionToken, setConnectionToken] = useState('');
  const myVideoRef = useRef(null);
  const [myStream, setMyStream] = useState(null);
  const mateVideoRefs = useRef({});
  const [mateStreams, setMateStreams] = useState([]);
  const [micOn, setMicOn] = useState(false);
  // -------------------------------------

  const getConnectionToken = async () => {
    const userData = {
      challengeId: challengeData.challengeId,
      userId,
      userName,
    };

    try {
      const response = await challengeServices.getConnectionToken({ userData });
      console.log('====Get openVidu token response: ', response);
      setConnectionToken(response.data.token);
    } catch (error) {
      console.error(error);
    }
  };

  const turnMicOnOff = () => {
    myStream.publishAudio(micOn);
    setMicOn(prev => !prev);
  };

  useEffect(() => {
    const OV = new OpenVidu();
    if (!connectionToken) return;

    const newSession = OV.initSession();
    setVideoSession(newSession);

    console.log('session Created: ', newSession);

    // 발행자 초기화 및 발행
    const initPublisher = () => {
      const publisher = OV.initPublisher(myVideoRef, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        mirror: false,
      });

      // 발행자 스트림 상태 업데이트
      setMyStream(publisher);

      // 세션에 발행자 추가
      newSession.publish(publisher);
    };

    // 세션 연결
    newSession.connect(connectionToken, error => {
      console.log('====Connection Try: ', connectionToken);
      if (error) {
        console.error('Connection error:', error);
      } else {
        console.log('Successfully connected to the session!');
        initPublisher();
      }
    });

    return () => {
      if (videoSession) {
        videoSession.off('streamCreated');
        videoSession.disconnect();
      }
      if (myStream) {
        myStream.dispose();
      }
    };
  }, [connectionToken]);

  useEffect(() => {
    if (videoSession) {
      // videoSession.on('streamCreated', event => {
      //   const newStream = videoSession.subscribe(event.stream, undefined);
      //   setMateStreams(prevStreams => [...prevStreams, newStream]);
      //   console.log(`New stream created. Stream ID: ${newStream.streamId}`);
      // });
      videoSession.onParticipantPublished = event => {
        const newStream = videoSession.getRemote(event.stream, undefined);
        setMateStreams(prevStreams => [...prevStreams, newStream]);
        console.log(`New stream created. Stream ID: ${newStream.streamId}`);
      };
    }
  }, [videoSession]);

  console.log('Mate Streams: ', mateStreams);

  return (
    <OpenViduContext.Provider
      value={{
        getConnectionToken,
        videoSession,
        micOn,
        turnMicOnOff,
        myVideoRef,
        myStream,
        setMyStream,
        mateVideoRefs,
        mateStreams,
      }}
    >
      {children}
    </OpenViduContext.Provider>
  );
};

export { OpenViduContext, OpenViduContextProvider };
