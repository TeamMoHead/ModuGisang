import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  AccountContext,
  GameContext,
  MediaPipeContext,
  OpenViduContext,
} from '../../../contexts';
import { LoadingWithText, WarmUpModel } from '../../../components';
import { CONFIGS } from '../../../config';

import backgroundImage from '../../../assets/backgroundImage.png';
import styled from 'styled-components';
import * as S from '../../../styles/common';

const LOADING_STATUS = {
  loadMyModel: (
    <>
      <p>게임에 필요한 AI를</p>
      <p> 준비중이에요</p>
    </>
  ),
  waitingMates: '친구들을 기다리는 중이에요',
};

const INSTRUCTIONS = ['🤾 모션인식 AI', '😆 안면인식 AI'];

const LoadModel = () => {
  const workerRef = useRef(null);
  const { userId: myId } = useContext(AccountContext);
  const {
    isPoseLoaded,
    isPoseInitialized,
    isHolisticLoaded,
    isHolisticInitialized,
    isWarmUpDone,
  } = useContext(MediaPipeContext);
  const {
    sendModelLoadingStart,
    sendMyReadyStatus,
    mateStreams,
    micOn,
    turnMicOnOff,
  } = useContext(OpenViduContext);
  const { matesReadyStatus, startFirstMission } = useContext(GameContext);
  const [loadingMode, setLoadingMode] = useState('loadMyModel');
  const [loadedModel, setLoadedModel] = useState({
    0: false,
    1: false,
  });
  const [loadedStates, setLoadedStates] = useState({
    poseLoaded: false,
    poseInitialized: false,
    holisticLoaded: false,
    holisticInitialized: false,
  });
  const [mateList, setMateList] = useState([]);
  const progressRef = useRef(0);

  useEffect(() => {
    if (micOn) {
      turnMicOnOff();
    }
    sendModelLoadingStart();
  }, []);

  useEffect(() => {
    if (isPoseLoaded && !loadedStates.poseLoaded) {
      progressRef.current += 25;
      setLoadedStates(prev => ({ ...prev, poseLoaded: true }));
    }
    if (isPoseInitialized && !loadedStates.poseInitialized) {
      progressRef.current += 25;
      setLoadedStates(prev => ({ ...prev, poseInitialized: true }));
      setLoadedModel(prev => ({ ...prev, 0: true }));
    }
    if (isHolisticLoaded && !loadedStates.holisticLoaded) {
      progressRef.current += 25;
      setLoadedStates(prev => ({ ...prev, holisticLoaded: true }));
    }
    if (isHolisticInitialized && !loadedStates.holisticInitialized) {
      setLoadedModel(prev => ({ ...prev, 1: true }));
      progressRef.current += 25;
      setLoadedStates(prev => ({ ...prev, holisticInitialized: true }));
    }
  }, [
    isPoseLoaded,
    isPoseInitialized,
    isHolisticLoaded,
    isHolisticInitialized,
    loadedStates,
  ]);

  useEffect(() => {
    if (isWarmUpDone) {
      sendMyReadyStatus();

      progressRef.current = 0;

      let mates = mateStreams.map(mate => ({
        userId: parseInt(JSON.parse(mate.stream.connection.data).userId),
        userName: JSON.parse(mate.stream.connection.data).userName,
        ready: false,
      }));
      mates.filter(mate => mate.userId !== myId);
      setMateList(mates);
      console.log('🍀, ', mateStreams, mates);

      setLoadingMode('waitingMates');
    }
  }, [isWarmUpDone, mateStreams]);

  useEffect(() => {
    if (isWarmUpDone && matesReadyStatus) {
      const matesWithoutMe = mateList.map(({ userId, userName }) => ({
        userId,
        userName,
        ready: matesReadyStatus[userId].ready,
      }));
      setMateList(matesWithoutMe);
      const readyMates = matesWithoutMe.filter(mate => mate.ready);

      progressRef.current = (readyMates?.length / mateList?.length) * 100;

      if (readyMates?.length === mateList?.length) {
        if (!micOn) {
          turnMicOnOff();
        }
        startFirstMission();
      }
    }
  }, [matesReadyStatus]);

  return (
    <>
      <Wrapper>
        <LoadingWithText loadingMSG={LOADING_STATUS[loadingMode]} />
        <ProgressBar>
          <ProgressWrapper>
            <ProgressIndicator $progress={progressRef.current} />
          </ProgressWrapper>
        </ProgressBar>
        {loadingMode === 'loadMyModel' &&
          INSTRUCTIONS.map((instructions, idx) => (
            <Introduction key={idx}>
              <StatusIcon $isLoaded={loadedModel[idx]} />
              <Instruction $isLoaded={loadedModel[idx]}>
                {instructions}
              </Instruction>
            </Introduction>
          ))}
        {loadingMode === 'waitingMates' &&
          mateList.map(({ userId, userName }, idx) => (
            <Introduction key={idx}>
              <StatusIcon $isLoaded={matesReadyStatus[userId]?.ready} />
              <Instruction $isLoaded={matesReadyStatus[userId]?.ready}>
                {userName}
              </Instruction>
            </Introduction>
          ))}
      </Wrapper>

      <WarmUpModel />
    </>
  );
};

export default LoadModel;

const Wrapper = styled.div`
  z-index: 900;
  position: fixed;
  width: 100vw;
  height: 100vh;

  padding: 30px;

  ${({ theme }) => theme.flex.center};
  flex-direction: column;

  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 30px;

  margin: 30px 0 20px 0;
`;

const ProgressWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 30px;

  border-radius: ${({ theme }) => theme.radius.small};
  border: 2px solid ${({ theme }) => theme.colors.primary.white};
  background-color: ${({ theme }) => theme.colors.translucent.navy};
`;

const ProgressIndicator = styled.div`
  position: absolute;
  top: 0;

  width: ${({ $progress }) => $progress}%;
  height: 100%;

  border-radius: ${({ theme }) => theme.radius.small};

  background-color: ${({ theme }) => theme.colors.primary.emerald};
  transition: width 0.2s ease;
`;

const Introduction = styled.div`
  ${({ theme }) => theme.flex.left};
`;

const StatusIcon = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;

  background-color: ${({ $isLoaded, theme }) =>
    $isLoaded ? theme.colors.primary.emerald : theme.colors.system.red};
`;

const Instruction = styled.p`
  ${({ theme }) => theme.fonts.IBMMedium};
  color: ${({ $isLoaded, theme }) =>
    $isLoaded ? theme.colors.primary.white : theme.colors.neutral.gray};

  text-align: center;
  margin-bottom: 10px;
`;

// useEffect(() => {
//   const worker = new Worker(
//     new URL(`${CONFIGS.BASE_URL}/socketWorker.bundle.js`, import.meta.url),
//   );
//   workerRef.current = worker;
//   console.log('workerRef.current', workerRef);
//   worker.onmessage = event => {
//     const { type, message, data } = event.data;
//     console.log(
//       '=============Data from Worker:: ============',
//       'TYPE: ',
//       type,
//       'MSG: ',
//       message,
//       'DATA: ',
//       data,
//     );

//     switch (type) {
//       case 'STATUS':
//         console.log('STATUS', message);
//         break;
//       case 'GAME_STATE':
//         console.log('GAME_STATE', data);
//         break;

//       case 'ERROR':
//         console.error('ERROR', message);
//         break;
//       default:
//         console.error('Unknown message type');
//     }
//   };

//   // worker.postMessage({
//   //   action: 'CONNECT',
//   //   payload: { url: `${CONFIGS.BASE_URL}:5001`, userId: 1 },
//   // });

//   return () => {
//     worker.postMessage({ action: 'DISCONNECT' });
//     worker.terminate();
//   };
// }, [isWarmUpDone]);
