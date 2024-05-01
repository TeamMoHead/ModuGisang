import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChallengeContext } from '../../contexts/ChallengeContext';
import { UserContext } from '../../contexts/UserContext';
import { GameContext } from '../../contexts/GameContext';
import { isPastTime } from './functions';
import InGameNav from './components/Nav/InGameNav';
import {
  Waiting,
  Mission1,
  Mission2,
  Mission3,
  Mission4,
  Affirmation,
  Result,
} from './';
import { MyVideo, MateVideo } from './components';
import styled from 'styled-components';

const GAME_MODE = {
  0: 'waiting',
  1: 'mission1',
  2: 'mission2',
  3: 'mission3',
  4: 'mission4',
  5: 'affirmation',
  6: 'result',
};

const GAME_MODE_COMPONENTS = {
  0: <Waiting />,
  1: <Mission1 />,
  2: <Mission2 />,
  3: <Mission3 />,
  4: <Mission4 />,
  5: <Affirmation />,
  6: <Result />,
};

const InGame = () => {
  const navigate = useNavigate();

  const { challengeId } = useParams();
  const { userInfo } = useContext(UserContext);
  const { userId: myId } = userInfo;
  const { challengeData, getChallengeData } = useContext(ChallengeContext);
  const {
    inGameMode,
    getConnectionToken,
    videoSession,
    startSession,
    myVideoRef,
    myStream,
    setMyStream,
  } = useContext(GameContext);

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
    } else return;
  }, [challengeData]);

  useEffect(() => {
    if (videoSession) {
      console.log('세션 생김!!');
    }
  }, [videoSession]);

  console.log('GAME MODE:: ', inGameMode);

  // if (
  //   GAME_MODE[inGameMode] === 'waiting' &&
  //   isPastTime(challengeData.wakeTime)
  // ) {
  //   alert('챌린지 참여 시간이 지났습니다. 메인 화면으로 이동합니다.');
  //   navigate('/main');
  //   return;
  // } else {
  return (
    <>
      <InGameNav />
      <Wrapper>
        <MyVideo />
        {GAME_MODE_COMPONENTS[inGameMode]}

        {/* {mateList.length > 0 && (
            <MatesVideoWrapper $isSingle={mateList.length === 1}>
              {mateList.map(({ userId }) => (
                <MateVideo key={userId} mateId={userId} />
              ))}
            </MatesVideoWrapper>
          )} */}
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
  // }
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
