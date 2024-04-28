import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { GameContext } from '../../contexts/GameContext';
import InGameNav from './components/Nav/InGameNav';
import { MyVideo, MateVideo } from './components';
import styled from 'styled-components';

const stages = {
  waiting: 'waiting',
  mission0: 'mission0',
  mission1: 'mission1',
  mission2: 'mission2',
  mission3: 'mission3',
  mission4: 'mission4',
  affirmation: 'affirmation',
  result: 'result',
};

const InGame = () => {
  // 유효한 사용자만이 이 페이지에 접근할 수 있도록 하기
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { challengeId } = useParams();
  const myVideoRef = useRef(null);
  const matesVideoRef = useRef({});
  // ------ myId 테스트용 나중에 지워야 함!!!!!!!!-----
  // 나중에 Context의 userInfo에서 받아오기
  const myId = 0;
  // ---------------------------------
  const {
    inGameMode,
    getChallengeData,
    challengeData,
    videoSession,
    startSession,
  } = useContext(GameContext);
  const [stage, setStage] = useState(stages.waiting);
  const [myStream, setMyStream] = useState(null);
  const [mateList, setMateList] = useState([]);

  const stopCamera = () => {
    if (myStream) {
      myStream.getTracks().forEach(track => {
        track.stop();
      });
      setMyStream(null);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
    } catch (error) {
      console.error(error);
      setMyStream(null);
    }
  };

  useEffect(() => {
    if (challengeId) {
      // getChallengeData();
    }
    return;
  }, [challengeId]);

  useEffect(() => {
    if (challengeData) {
      setMateList(challengeData.mates.filter(mate => mate.id !== myId));
      startSession();
    }
    return;
  }, [challengeData]);

  // 현재시간과 challenge 시작시간 비교해서,
  // challenge 시작시간이 지났으면 setIsWaiting(false)
  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  useEffect(() => {
    if (videoSession) {
      console.log('세션 생김!!');
    }
  }, [videoSession]);

  return (
    <>
      <InGameNav />
      <Wrapper>
        <MyVideo startCamera={startCamera} ref={myVideoRef} />
        {mateList.length > 0 && (
          <MatesVideoWrapper $isSingle={mateList.length === 1}>
            {mateList.map(({ id, name }) => (
              <MateVideo
                key={id}
                name={name}
                // stream={matesStream.stream}
                // ref={matesVideoRef.current[id]}
              />
            ))}
          </MatesVideoWrapper>
        )}
        <CloseVideoBtn
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            stopCamera();
          }}
        >
          stop camera
        </CloseVideoBtn>
      </Wrapper>
    </>
  );
};

export default InGame;

const Wrapper = styled.div``;

const MatesVideoWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  width: 100vw;
  padding: 0px 32px;
  ${({ theme, $isSingle }) =>
    $isSingle ? theme.flex.right : theme.flex.between}
  gap: 10px;
`;

const CloseVideoBtn = styled.button`
  z-index: 20;
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translate(-50%, 0);

  width: 100px;
  height: 50px;
  border-radius: ${({ theme }) => theme.radius.round};
  background-color: orange;
  color: white;
  cursor: pointer;
`;
