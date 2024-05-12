import React from 'react';
import styled from 'styled-components';

const GameRound = ({ text }) => {
  return (
    <Wrapper>
      <Text>Round</Text>
      <Number>{text}</Number>
    </Wrapper>
  );
};

export default GameRound;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px 0;
  ${({ theme }) => theme.flex.between}
`;

const Text = styled.div`
  position: absolute;
  top: -20px;
  left: -3px;
  ${({ theme }) => theme.fonts.IBMsmall}
  color: ${({ theme }) => theme.colors.primary.purple};
`;

const Number = styled.div`
  position: absolute;
  top: 5px;
  left: 0px;
  ${({ theme }) => theme.flex.center}
  padding-top: 3px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary.purple};
  font: 700 30px 'Jua';
  color: ${({ theme }) => theme.colors.primary.white};
`;
