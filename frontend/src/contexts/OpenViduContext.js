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
  const [OVInstance, setOVInstance] = useState(null); // OpenVidu 객체 [openvidu-browser
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

  const leaveSession = () => {
    if (videoSession) {
      videoSession.disconnect();
    }

    setOVInstance(null);
    setVideoSession(null);
    setMateStreams([]);
    setMyStream(null);
  };

  useEffect(() => {
    if (!challengeData.challengeId) return;
    getConnectionToken();
  }, [challengeData]);

  useEffect(() => {
    if (!connectionToken) return;

    const OV = new OpenVidu();
    const newSession = OV.initSession();

    setOVInstance(OV);
    setVideoSession(newSession);
  }, [connectionToken]);

  useEffect(() => {
    if (!videoSession) return;

    videoSession.on('streamCreated', event => {
      const mateStream = videoSession.subscribe(event.stream, undefined);
      setMateStreams(prev => [...prev, mateStream]);
    });

    videoSession.on('streamDestroyed', event => {
      const thisStream = event.stream.streamManager;
      setMateStreams(prev =>
        prev.filter(mateStream => mateStream !== thisStream),
      );
    });

    videoSession.on('exception', exception => {
      console.warn(exception);
    });

    videoSession.on('signal:test', event => {
      console.log('---Signal Test:: ', event);
      if (event.data === userId.userId) {
        leaveSession();
      }
    });

    const initPublisher = async () => {
      const publisher = await OVInstance.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 20,
        mirror: true,
      });

      videoSession.publish(publisher);
      setMyStream(publisher);
    };

    // 세션 연결
    videoSession.connect(connectionToken).then(async () => {
      try {
        await initPublisher();
      } catch (error) {
        console.error('/// Connecting OV error:', error);
      }
    });

    return () => {
      if (videoSession) {
        videoSession.off('streamCreated');
        videoSession.disconnect();
      }
      if (myStream) {
        myStream.dispose();
        mateStreams.forEach(stream => stream.dispose());
      }
    };
  }, [videoSession]);

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
