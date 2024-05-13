import React, { useState, useEffect, useContext } from 'react';
import { GameContext } from '../../../contexts';
import styled, { keyframes } from 'styled-components';

const MissionEnding = () => {
  const { isMissionEnding, setIsMissionEnding, myMissionStatus, inGameMode } =
    useContext(GameContext);
  const [timer, setTimer] = useState(2);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (!isMissionEnding) return;

    console.log('💕💕💕IS MISSION ENDING MOUNTED!💕💕');
    console.log('myMissionStatus:', myMissionStatus);
    console.log('isMissionEnding:', isMissionEnding);

    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(interval);
          setIsOver(true);
          setIsMissionEnding(false);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isMissionEnding, myMissionStatus, setIsMissionEnding]);

  if (!isMissionEnding) return null;

  return (
    <Wrapper title="ResultWrapper">
      {!isOver && (
        <Result key={inGameMode}>{myMissionStatus ? 'O' : 'X'}</Result>
      )}
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

// const fadeInOut = keyframes`
//   0% {
//     opacity: 1;
//     font-size: 100vw;
//   }
//   100% {
//     opacity: 0;
//     font-size: 0;
//     display: none;
//   }
// `;

const Result = styled.span`
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.flex.center};
  color: ${({ theme }) => theme.colors.white};
  -webkit-text-stroke: ${({ theme }) => theme.colors.primary.emerald} 4px;

  font: 700 400px 'Jua';
  z-index: 5;
`;
