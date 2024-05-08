import React, { useState, useEffect, useContext } from 'react';
import { GameContext } from '../../../contexts';
import styled from 'styled-components';

const GameLoading = () => {
  const { setIsGameLoading } = useContext(GameContext);
  const [timer, setTimer] = useState(3);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    console.log('💕💕💕IS GAME LOADING MOUNTED!💕💕');
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
      setIsGameLoading(false);
    }
  }, [timer]);

  return (
    <Wrapper>
      {!isOver && <AnimatedNumber key={timer}>{timer}</AnimatedNumber>}
    </Wrapper>
  );
};

export default GameLoading;

const Wrapper = styled.div`
  z-index: 400;
  width: 100vw;
  height: 100vh;
  ${({ theme }) => theme.flex.center};

  margin: auto;
`;

const AnimatedNumber = styled.div`
  ${({ theme }) => theme.flex.center};

  color: ${({ theme }) => theme.colors.light};
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
