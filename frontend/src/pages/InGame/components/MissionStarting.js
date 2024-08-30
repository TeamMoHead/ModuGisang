import React, { useState, useEffect, useContext } from 'react';
import { GameContext } from '../../../contexts';
import styled from 'styled-components';

const MissionStarting = () => {
  const { setIsMissionStarting } = useContext(GameContext);
  const [timer, setTimer] = useState(3);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(prevTimer => prevTimer - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  useEffect(() => {
    if (timer === 0) {
      setIsOver(true);
      setIsMissionStarting(false);
    }
  }, [timer]);

  return (
    <Wrapper>
      {!isOver && <AnimatedNumber key={timer}>{timer}</AnimatedNumber>}
    </Wrapper>
  );
};

export default MissionStarting;

const Wrapper = styled.div`
  z-index: 400;

  position: fixed;
  left: 0;
  top: 0;

  width: 100vw;
  height: 100vh;

  ${({ theme }) => theme.flex.center};

  margin: auto;

  font: 700 50px 'Jua';
`;

const AnimatedNumber = styled.span`
  ${({ theme }) => theme.flex.center};

  color: ${({ theme }) => theme.colors.white};
  -webkit-text-stroke: ${({ theme }) => theme.colors.primary.emerald} 4px;

  animation: fadeOut 1s linear;
  @keyframes fadeOut {
    0% {
      opacity: 1;
      font-size: 100vw;
    }
    100% {
      opacity: 0;
      font-size: 0px;
      display: none;
    }
  }
  transition: opacity 0.5s;
`;
