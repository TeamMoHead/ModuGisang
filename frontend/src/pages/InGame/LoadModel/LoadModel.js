import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  GameContext,
  MediaPipeContext,
  OpenViduContext,
} from '../../../contexts';
import { WarmUpModel } from '../../../components';
import { CONFIGS } from '../../../config';
import styled from 'styled-components';
import * as S from '../../../styles/common';

const INSTRUCTIONS = {
  loadingMyModel: '게임에 필요한 AI 모델을 준비중입니다...',
  waitingMatesToBeReady: '친구들을 기다리는 중입니다...',
};

const LoadModel = () => {
  const workerRef = useRef(null);
  const { isWarmUpDone } = useContext(MediaPipeContext);
  const { sendModelLoadingStart, sendMyReadyStatus } =
    useContext(OpenViduContext);
  const { isMyReadyStatusSent, matesReadyStatus, startFirstMission } =
    useContext(GameContext);
  const [instructionMode, setInstructionMode] = useState('loadingMyModel');

  useEffect(() => {
    sendModelLoadingStart();
  }, []);

  useEffect(() => {
    if (isWarmUpDone) {
      console.log('***** IS WRAM UP DONE!!! *****', isWarmUpDone);
      sendMyReadyStatus();
    }
  }, [isWarmUpDone]);

  useEffect(() => {
    if (isMyReadyStatusSent) {
      setInstructionMode('waitingMatesToBeReady');
    }
  }, [isMyReadyStatusSent]);

  useEffect(() => {
    if (
      isMyReadyStatusSent &&
      matesReadyStatus.every(mate => mate?.ready === true)
    ) {
      startFirstMission();
    }
  }, [isMyReadyStatusSent, matesReadyStatus]);

  console.log('친구들 상태 : ', matesReadyStatus);
  return (
    <>
      <Wrapper>
        <Instruction>{INSTRUCTIONS[instructionMode]}</Instruction>
        <ProgressBar>
          <ProgressWrapper>
            <ProgressIndicator
              $progress={
                matesReadyStatus.filter(mate => mate.ready === true).length
              }
            />
          </ProgressWrapper>
        </ProgressBar>
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

  ${({ theme }) => theme.flex.center};

  background-color: ${({ theme }) => theme.colors.primary.navy};
`;

const Instruction = styled.p`
  position: absolute;

  ${({ theme }) => theme.fonts.JuaSmall};
  color: ${({ theme }) => theme.colors.primary.white};

  text-align: center;
  margin-bottom: 20px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 30px;
`;

const ProgressWrapper = styled.div`
  position: absolute;
  bottom: 25px;

  width: 80%;
  height: 30px;

  border-radius: ${({ theme }) => theme.radius.small};
  border: 2px solid ${({ theme }) => theme.colors.primary.white};
  background-color: ${({ theme }) => theme.colors.translucent.navy};
`;

const ProgressIndicator = styled.div`
  position: absolute;

  width: ${({ progress }) => progress}%;
  height: 100%;

  border-radius: ${({ theme }) => theme.radius.small};

  background-color: ${({ theme }) => theme.colors.primary.emerald};
  transition: width 0.2s ease;
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
