import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ChallengeContext } from '../../contexts/ChallengeContext';
import { UserContext } from '../../contexts/UserContext';
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
  const { userInfo } = useContext(UserContext);
  const { userId: myId } = userInfo;
  const { getChallengeData } = useContext(ChallengeContext);
  const {
    inGameMode,
    getConnectionToken,
    challengeData,
    videoSession,
    startSession,
    myStream,
    setMyStream,
  } = useContext(GameContext);
  const [stage, setStage] = useState(stages.waiting);
  const [mateList, setMateList] = useState([]);

  const stopCamera = () => {
    if (myStream) {
      myStream.getTracks().forEach(track => {
        track.stop();
      });
      setMyStream(null);
    }
  };

  useEffect(() => {
    if (challengeId) {
      getChallengeData(challengeId);
    }
    return;
  }, [challengeId]);

  useEffect(() => {
    if (challengeData) {
      setMateList(challengeData.mates.filter(mate => mate.id !== myId));
      getConnectionToken();

      startSession();
    }
    return;
  }, [challengeData]);

  // 현재시간과 challenge 시작시간 비교해서,
  // challenge 시작시간이 지났으면 setIsWaiting(false)

  useEffect(() => {
    if (videoSession) {
      console.log('세션 생김!!');
    }
  }, [videoSession]);

  console.log('USER INFO:  ', userInfo);

  return (
    <>
      <InGameNav />
      <Wrapper>
        <MyVideo />
        {mateList.length > 0 && (
          <MatesVideoWrapper $isSingle={mateList.length === 1}>
            {mateList.map(({ userId }) => (
              <MateVideo key={userId} mateId={userId} />
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
