import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  UserContext,
  ChallengeContext,
  GameContext,
  OpenViduContext,
} from '../../contexts';

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
import { SimpleBtn } from '../../components';

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
  const { challengeId } = useParams();
  const { userInfo } = useContext(UserContext);
  const { userId: myId } = userInfo;
  const { challengeData, getChallengeData } = useContext(ChallengeContext);
  const { inGameMode, setMyMissionStatus } = useContext(GameContext);

  const [mateList, setMateList] = useState([]);

  useEffect(() => {
    if (challengeId) {
      getChallengeData(challengeId);
    }
  }, [challengeId]);

  useEffect(() => {
    if (challengeData) {
      setMateList(challengeData.mates.filter(mate => mate.userId !== myId));
    } else return;
  }, [challengeData]);

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

        <button
          onClick={() => setMyMissionStatus(prev => !prev)}
          style={{
            zIndex: 300,
            position: 'fixed',
            top: '150px',
            right: '50px',
            backgroundColor: 'orange',
            padding: '10px',
          }}
        >
          My Mission Status
        </button>

        <React.Fragment key={inGameMode}>
          {GAME_MODE_COMPONENTS[inGameMode]}
        </React.Fragment>

        {mateList.length > 0 && (
          <MatesVideoWrapper $isSingle={mateList.length === 1}>
            {mateList.map(({ userId, userName }) => (
              <MateVideo key={userId} mateId={userId} mateName={userName} />
            ))}
          </MatesVideoWrapper>
        )}
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
