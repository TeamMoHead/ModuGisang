import React, { createContext, useState, useEffect } from 'react';
import { Openvidu } from 'openvidu-browser';
import { challengeServices } from '../apis/challengeServices';
const GameContext = createContext();

// create provider
const GameContextProvider = ({ children }) => {
  const [videoSession, setVideoSession] = useState(null);
  const [inGameMode, setInGameMode] = useState('waiting');
  const [missionNum, setMissionNum] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [challengeData, setChallengeData] = useState(null);

  const getChallengeData = async () => {
    // try {
    //   const response = await challengeServices.getChallengeInfo(challengeId);
    //   setChallengeData(response.data);
    // } catch (error) {
    //   console.error(error);
    //
    // ------테스트용 값 나중에 지워야 함!!!!!!!!-----
    setChallengeData({
      challengeId: 1234,
      startDate: '2021-09-01T00:00:00.000Z',
      wakeTime: '05:30:00',
      mates: [
        { id: 0, name: '천사박경원' },
        { id: 1, name: '귀요미이시현' },
        { id: 2, name: '깜찍이이재원' },
        // { id: 3, name: '상큼이금도현' },
        // { id: 4, name: '똑똑이연선애' },
      ],
    });
    // ----------------------------------------------
    // }
  };

  const startSession = () => {
    // const OV = new Openvidu();
    // let session = OV.initSession();
    // session.on('streamCreated', event => {
    //   session.subscribe(event.stream, 'video-container');
    // });
    // session.connect('token', { clientData: 'clientData' }, error => {
    //   if (error) {
    //     console.error(error);
    //   } else {
    //     session.publish('myVideo');
    //   }
    // });
    // setVideoSession(session);
  };

  const turnMicOnOff = () => {
    // openVidu로 마이크 토글하는 함수 추가
    setMicOn(prev => !prev);
  };

  return (
    <GameContext.Provider
      value={{
        getChallengeData,
        challengeData,
        videoSession,
        startSession,
        micOn,
        turnMicOnOff,
        inGameMode,
        missionNum,
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
            const publisher = OV.initPublisher('my-video-container', {
                audio: true,  // 오디오 활성화
                video: true,  // 비디오 활성화
                resolution: '640x480'
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
