import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import { Openvidu } from 'openvidu-browser';
import { UserContext } from './UserContext';
import { ChallengeContext } from './ChallengeContext';
import { challengeServices } from '../apis/challengeServices';

const GameContext = createContext();

const GAME_MODE = {
  0: 'waiting',
  1: 'mission1',
  2: 'mission2',
  3: 'mission3',
  4: 'mission4',
  5: 'affirmation',
  6: 'result',
};

// mission 당 소요 시간
const GAME_MODE_DURATION = {
  1: 10000,
  2: 10000,
  3: 10000,
  4: 10000,
  5: 10000,
};

const GameContextProvider = ({ children }) => {
  const { userInfo } = useContext(UserContext);
  const { challengeData } = useContext(ChallengeContext);
  const { userId, userName } = userInfo;
  const [inGameMode, setInGameMode] = useState(() => {
    const savedMode = localStorage.getItem('inGameMode');
    return savedMode ? JSON.parse(savedMode) : 0;
  });

  // ------ openvidu 관련 state --------
  const [videoSession, setVideoSession] = useState(null);
  const [connectionToken, setConnectionToken] = useState('');
  const myVideoRef = useRef(null);
  const [myStream, setMyStream] = useState(null);
  const mateVideoRefs = useRef(null);
  const [mateStreams, setMateStreams] = useState([]);
  const [micOn, setMicOn] = useState(false);

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

  const startSession = () => {
    // const OV = new Openvidu();
    // let session = OV.initSession();
    // session.on('streamCreated', event => {
    //   session.subscribe(event.stream, 'video-container');
    // });
    // session.connect(token, error => {
    //   if (error) {
    //     console.error(error);
    //   } else {
    //     session.publish('myVideo');
    //   }
    // });
    // setVideoSession(session);
  };

  const turnMicOnOff = () => {
    myStream.publishAudio(micOn);
    setMicOn(prev => !prev);
  };

  // ================= 게임 모드 변경 =================
  let nextMode = 1;
  const updateMode = () => {
    nextMode += 1;
    if (nextMode <= 7) {
      localStorage.setItem('inGameMode', JSON.stringify(nextMode));
      setInGameMode(nextMode);

      if (nextMode !== 6) {
        // result 모드 아니면 다음 모드로 자동 전환
        setTimeout(updateMode, GAME_MODE_DURATION[nextMode]);
      }

      if (nextMode === 6) {
        localStorage.setItem('inGameMode', JSON.stringify(0));
      }
    }
  };

  const scheduleFirstMission = wakeTime => {
    const now = new Date();
    const wakeTimeDate = new Date(now);
    const [hours, minutes] = wakeTime.split(':').map(Number);
    wakeTimeDate.setHours(hours, minutes, 0, 0);

    // 이미 지난 시간인 경우 다음날로 설정
    if (wakeTimeDate < now) {
      wakeTimeDate.setDate(now.getDate() + 1);
    }

    const delay = wakeTimeDate - now;

    setTimeout(() => {
      localStorage.setItem('inGameMode', JSON.stringify(1));
      setInGameMode(1); // waiting 끝나면 첫 미션으로 전환
      setTimeout(updateMode, GAME_MODE_DURATION[1]); // 첫 미션 후 다음 모드로 전환 시작
    }, delay);
  };

  useEffect(() => {
    if (challengeData) {
      scheduleFirstMission(challengeData.wakeTime);
    }
  }, [challengeData]);

  return (
    <GameContext.Provider
      value={{
        getConnectionToken,
        videoSession,
        startSession,
        micOn,
        turnMicOnOff,
        inGameMode,
        myVideoRef,
        myStream,
        setMyStream,
        mateVideoRefs,
        mateStreams,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameContextProvider };

/**
import React, { useState, useEffect } from 'react';
import { OpenVidu } from 'openvidu-browser';

function VideoSession({ token }) {
    const [session, setSession] = useState(null);
    const [streams, setStreams] = useState([]);
    const [myStream, setMyStream] = useState(null); // 발행 스트림 상태

    useEffect(() => {
        const OV = new OpenVidu();
        const newSession = OV.initSession();
        setSession(newSession);

        newSession.on('streamCreated', (event) => {
            const newStream = event.stream;
            setStreams(prevStreams => [...prevStreams, newStream]);
            console.log(`New stream created. Stream ID: ${newStream.streamId}`);
        });

        // 발행자 초기화 및 발행
        const initPublisher = () => {
            const publisher = OV.initPublisher(myVideoRef, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480'
                frameRate: 30,
                mirror: false,
            });

            // 발행자 스트림 상태 업데이트
            setMyStream(publisher);

            // 세션에 발행자 추가
            newSession.publish(publisher);
        };

        // 세션 연결
        newSession.connect(token, (error) => {
            if (error) {
                console.error('Connection error:', error);
            } else {
                console.log('Successfully connected to the session!');
                initPublisher();
            }
        });

        return () => {
            if (session) {
                session.off('streamCreated');
                session.disconnect();
            }
            if (myStream) {
                myStream.dispose();
            }
        };
    }, [token]);

    return (
        <div>
            <div id="my-video-container"></div> // 발행자 비디오 컨테이너
            
            // 구독자 비디오 컨테이너
            {streams.map((stream, index) => (
              <div key={index} id={`video-container-${stream.streamId}`}>
              </div>
          ))}
      </div>
  );
}

export default VideoSession;


*/
