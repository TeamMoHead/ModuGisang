import React, { useEffect, useContext } from 'react';
import { GameContext } from '../../../contexts';
import { rainEffect } from '../Mission4/effect';

import styled, { keyframes } from 'styled-components';

// const thunderstormSoundEffect = () => {
//   const volume = 0.5;
//   const audio = new Audio(thunderstorm);
//   audio.volume = volume;

//   // 사운드 재생
//   audio.play();

//   // 2초 후에 페이드 아웃 시작
//   setTimeout(() => {
//     const fadeOutInterval = setInterval(() => {
//       if (audio.volume <= 0.05) {
//         clearInterval(fadeOutInterval);
//         audio.pause(); // 오디오 재생 중지
//       } else {
//         audio.volume -= volume / 10; // 0.05
//       }
//     }, 100);
//   }, 2000);
// };

const MissionEnding = ({ canvasRef }) => {
  const {
    isMissionEnding,
    setIsMissionEnding,
    myMissionStatus,
    inGameMode,
    isMusicMuted,
  } = useContext(GameContext);

  useEffect(() => {
    if (!isMissionEnding) return;

    if (inGameMode === 4 && !myMissionStatus) {
      rainEffect(canvasRef, 2);
    }
  }, [isMissionEnding, myMissionStatus, setIsMissionEnding]);

  if (!isMissionEnding) return null;

  return (
    <Wrapper title="ResultWrapper">
      {
        <Result
          key={inGameMode}
          myMissionStatus={myMissionStatus}
          inGameMode={inGameMode}
        >
          {myMissionStatus ? 'O' : 'X'}
        </Result>
      }
    </Wrapper>
  );
};

export default MissionEnding;

const Wrapper = styled.div`
  z-index: 400;

  position: fixed;

  width: 100vw;
  height: 100vh;

  ${({ theme }) => theme.flex.center};

  margin: auto;
  font: 700 50px 'Jua';
`;

const fadeInOut = keyframes`
  0%, 50%, 100% { opacity: 0; }
  25%, 75% { opacity: 1; }
`;

const Result = styled.span`
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.flex.center};
  background-color: ${({ theme, inGameMode }) =>
    inGameMode === 4 ? 'transparent' : theme.colors.translucent.navy};
  color: ${({ theme }) => theme.colors.white};
  -webkit-text-stroke: ${({ theme, myMissionStatus }) =>
      myMissionStatus ? theme.colors.primary.emerald : theme.colors.system.red}
    4px;
  animation: ${fadeInOut} 2000ms ease-in-out;

  font: 700 400px 'Jua';
  z-index: 15;
`;
