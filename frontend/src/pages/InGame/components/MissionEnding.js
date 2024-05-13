import React, { useState, useEffect, useContext } from 'react';
import { GameContext } from '../../../contexts';
import styled, { keyframes } from 'styled-components';

const MissionEnding = ({ eventHandler, canvasRef }) => {
  const { isMissionEnding, setIsMissionEnding, myMissionStatus, inGameMode } =
    useContext(GameContext);

  useEffect(() => {
    if (!isMissionEnding) return;

    console.log('💕💕💕IS MISSION ENDING MOUNTED!💕💕');
    console.log('myMissionStatus:', myMissionStatus);
    console.log('isMissionEnding:', isMissionEnding);

    if (inGameMode === 4 && !myMissionStatus) {
      eventHandler.rainEffect(canvasRef, 2);
      eventHandler.thunderstormSoundEffect();
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
  position: absolute;
  overflow: hidden;
  top: 0;
  right: 0;
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
