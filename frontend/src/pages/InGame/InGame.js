import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChallengeContext,
  GameContext,
  OpenViduContext,
  MediaPipeContext,
  AccountContext,
} from '../../contexts';
import useCheckTime from '../../hooks/useCheckTime';

import InGameNav from './components/Nav/InGameNav';
import { MyVideo, MateVideo } from './components';
import { Result } from './';

import { BackgroundMusic, MusicController, MissionSoundEffects } from './Sound';

import styled, { css } from 'styled-components';
import * as S from '../../styles/common';

const GAME_MODE = {
  0: 'waiting',
  1: 'mission1',
  2: 'mission2',
  3: 'mission3',
  4: 'mission4',
  5: 'affirmation',
  6: 'result',
};

const InGame = () => {
  const navigate = useNavigate();
  const { userId: myId } = useContext(AccountContext);
  const { challengeData } = useContext(ChallengeContext);
  const { isTooEarly, isTooLate } = useCheckTime(challengeData?.wakeTime);
  const { inGameMode, isEnteredTimeSent, sendEnteredTime } =
    useContext(GameContext);
  const { myStream, myVideoRef } = useContext(OpenViduContext);
  const {
    poseModel,
    holisticModel,
    setIsPoseLoaded,
    setIsPoseInitialized,
    setIsHolisticLoaded,
    setIsHolisticInitialized,
    setIsWarmUpDone,
  } = useContext(MediaPipeContext);
  const [redirected, setRedirected] = useState(false);

  const [mateList, setMateList] = useState([]);

  // const musicSrc = getMusicSrc(inGameMode);

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

    // console.log('inGameMode:', inGameMode);

    return () => {
      // localStorage.removeItem('inGameMode');
      if (myVideoRef.current) {
        if (myStream instanceof MediaStream) {
          myStream.getTracks().forEach(track => track.stop());
          myVideoRef.current.srcObject = null;
        }
      }
    };
  }, [inGameMode, isTooEarly, isTooLate, redirected]);

  useEffect(() => {
    if (inGameMode === 0) {
      if (isEnteredTimeSent) {
        return;
      } else {
        sendEnteredTime();
      }
    }
    if (inGameMode === 6) {
      poseModel.current = null;
      holisticModel.current = null;
      setIsPoseLoaded(false);
      setIsPoseInitialized(false);
      setIsHolisticLoaded(false);
      setIsHolisticInitialized(false);
      setIsWarmUpDone(false);
    }
  }, [inGameMode, isEnteredTimeSent]);

  useEffect(() => {
    // inGame unmount될 때 poseModel, holisticModel 초기화
    return () => {
      poseModel.current = null;
      holisticModel.current = null;
      setIsPoseLoaded(false);
      setIsPoseInitialized(false);
      setIsHolisticLoaded(false);
      setIsHolisticInitialized(false);
      setIsWarmUpDone(false);
    };
  }, []);

  if (redirected) return null;
  return (
    <>
      <InGameNav />
      {/* <BackgroundMusic /> */}
      {/* <MissionSoundEffects /> */}
      <MusicController />

      {GAME_MODE[inGameMode] !== 'result' && (
        <Wrapper $hasMate={mateList?.length > 0}>
          <>
            <MyVideo />
            <MatesVideoWrapper $isSingle={mateList?.length === 1}>
              {mateList?.length > 0 &&
                mateList?.map(({ userId, userName }) => (
                  <MateVideo key={userId} mateId={userId} mateName={userName} />
                ))}
            </MatesVideoWrapper>
          </>
        </Wrapper>
      )}
      {GAME_MODE[inGameMode] === 'result' && <Result />}
    </>
  );
};

export default InGame;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;

  overflow: hidden;
  padding: 104px 24px 30px 24px;

  ${({ $hasMate }) =>
    $hasMate &&
    css`
      display: grid;
      grid-template-rows: auto 150px;
      gap: 10px;
      padding: 104px 24px 0px 24px;
    `};
`;

const MatesVideoWrapper = styled.div`
  width: 100%;
  height: 150px;

  ${({ theme, $isSingle }) =>
    $isSingle ? theme.flex.right : theme.flex.between}

  gap: 12px;
`;
