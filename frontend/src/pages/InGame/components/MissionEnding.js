import React, { useEffect, useContext } from 'react';
import { GameContext } from '../../../contexts';
import { rainEffect } from '../Mission4/effect';

import styled, { css, keyframes } from 'styled-components';

const MissionEnding = ({ canvasRef }) => {
  const { isMissionEnding, setIsMissionEnding, myMissionStatus, inGameMode } =
    useContext(GameContext);

  useEffect(() => {
    if (!isMissionEnding) return;

    if (inGameMode === 4 && !myMissionStatus) {
      rainEffect(canvasRef, 2);
    }
  }, [isMissionEnding, myMissionStatus, setIsMissionEnding]);

  if (!isMissionEnding) return null;
  return (
    <Wrapper inGameMode={inGameMode}>
      <Result
        key={inGameMode}
        $myMissionStatus={myMissionStatus}
        inGameMode={inGameMode}
      >
        <Text $myMissionStatus={myMissionStatus}>
          {myMissionStatus ? '좋아요!' : '앗..!'}
        </Text>
      </Result>
    </Wrapper>
  );
};

export default MissionEnding;

const shaking = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(-10px, -10px) rotate(-5deg);
  }
  75% {
    transform: translate(-10px, 10px) rotate(-5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
`;

const sweeping = keyframes`
0% {
    background-position: -150% -150%;
  }
  100% {
    background-position: 150% 150%;
  }
`;

const emeraldGlow = keyframes`
  0% {
    box-shadow: 0 0 10px 0 rgba(21, 245, 186, 0.5);
  }
  50% {
    border-color: rgba(21, 245, 186, 1);
    box-shadow: 0 0 20px 0 rgba(21, 245, 186, 0.7);
  }
  100% {
    box-shadow: 0 0 10px 0 rgba(21, 245, 186, 0.5);
  }
`;

const redGlow = keyframes`
  0% {
    box-shadow: 0 0 10px 0 rgba(255, 0, 143, 0.5);
  }
  50% {
    border-color: rgba(255, 0, 143, 1);
    box-shadow: 0 0 20px 0 rgba(255, 0, 143, 0.7);
  }
  100% {
    box-shadow: 0 0 10px 0 rgba(255, 0, 143, 0.5);
  }
`;

const Wrapper = styled.div`
  z-index: 800;

  position: fixed;

  width: 100vw;
  height: 100vh;

  ${({ theme }) => theme.flex.center};
  margin: auto;

  background-color: ${({ theme, inGameMode }) =>
    inGameMode === 4 ? 'transparent' : theme.colors.translucent.navy};
  backdrop-filter: blur(3px);
`;

const Result = styled.span`
  z-index: 15;

  width: 100%;
  ${({ theme }) => theme.flex.center};
  padding: 30px 0;

  background-color: ${({ theme }) => theme.colors.translucent.white};
  backdrop-filter: blur(2px);

  border-top: 4px solid
    ${({ theme, $myMissionStatus }) =>
      $myMissionStatus
        ? theme.colors.primary.emerald
        : theme.colors.system.red};
  border-bottom: 4px solid
    ${({ theme, $myMissionStatus }) =>
      $myMissionStatus
        ? theme.colors.primary.emerald
        : theme.colors.system.red};
  box-shadow: 0 0 12px 0
    ${({ theme, $myMissionStatus }) =>
      $myMissionStatus
        ? theme.colors.primary.emerald
        : theme.colors.system.red};

  animation: ${({ $myMissionStatus }) =>
      $myMissionStatus ? emeraldGlow : redGlow}
    2s infinite alternate ease-in-out;
`;

const Text = styled.span`
  text-align: center;

  font: 700 60px 'Jua';
  color: ${({ theme }) => theme.colors.white};
  -webkit-text-stroke: ${({ theme, $myMissionStatus }) =>
      $myMissionStatus ? theme.colors.primary.emerald : theme.colors.system.red}
    2px;

  ${({ $myMissionStatus }) =>
    $myMissionStatus
      ? css`
          color: ${({ theme }) => theme.colors.primary.navy};
          background: linear-gradient(
            135deg,
            #0d0a2d 25%,
            #fff 50%,
            #0d0a2d 75%
          );
          background-size: 200% 200%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: ${sweeping} 1s infinite alternate;
        `
      : css`
          animation: ${shaking} 0.3s infinite alternate;
        `};
`;
