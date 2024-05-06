import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  UserContext,
  ChallengeContext,
  GameContext,
  OpenViduContext,
} from '../../contexts';
import useCheckTime from '../../hooks/useCheckTime';

import InGameNav from './components/Nav/InGameNav';
import { MyVideo, MateVideo, GameLoading } from './components';
import {
  Waiting,
  Mission1,
  Mission2,
  Mission3,
  Mission4,
  Affirmation,
  Result,
} from './';
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
  const { userInfo } = useContext(UserContext);
  const { userId: myId } = userInfo;
  const { challengeData } = useContext(ChallengeContext);
  const { isTooEarly, isTooLate } = useCheckTime(challengeData?.wakeTime);
  const { isGameLoading, inGameMode, setMyMissionStatus } =
    useContext(GameContext);
  const { myStream, myVideoRef } = useContext(OpenViduContext);
  const [redirected, setRedirected] = useState(false);

  const [mateList, setMateList] = useState([]);

  useEffect(() => {
    if (challengeData) {
      setMateList(challengeData?.mates?.filter(mate => mate.userId !== myId));
    } else return;
  }, [challengeData]);

  useEffect(() => {
    // ================== ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ ==================
    // -------------⭐️ 개발 완료 후 주석 해제 필요 ⭐️ -------------
    // ================== ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ ==================
    // if (GAME_MODE[inGameMode] === 'waiting') {
    //   if (isTooLate) {
    //     alert('챌린지 참여 시간이 지났습니다.');
    //     setRedirected(true);
    //     navigate('/main');
    //   } else if (isTooEarly) {
    //     alert('챌린지 시작 시간이 아닙니다.');
    //     setRedirected(true);
    //     navigate('/main');
    //   }
    // }
    return () => {
      // localStorage.removeItem('inGameMode');
      if (myVideoRef.current) {
        if (myStream instanceof MediaStream) {
          myStream.getTracks().forEach(track => track.stop());
          myVideoRef.current.srcObject = null; // 비디오 요소에서 스트림 연결을 해제합니다.
        }
      }
    };
  }, [inGameMode, isTooEarly, isTooLate, redirected]);

  if (redirected) return null;
  return (
    <>
      <InGameNav />
      <Wrapper>
        {/* {inGameMode < 3 && isGameLoading && <GameLoading />} */}

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

        {mateList?.length > 0 && (
          <MatesVideoWrapper $isSingle={mateList?.length === 1}>
            {mateList?.map(({ userId, userName }) => (
              <MateVideo key={userId} mateId={userId} mateName={userName} />
            ))}
          </MatesVideoWrapper>
        )}
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
