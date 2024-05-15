import React, { useState, useContext, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { StreakContent } from '../../Main/cardComponents';
import { useLocation } from 'react-router-dom';

const FriendStreak = () => {
  const location = useLocation();
  const { userData } = location.state;
  return (
    <Wrapper>
      <Box>
        <UserName>{userData.userName}</UserName>
        <SeperateLine />
        <StreakContent userData={userData} />
      </Box>
    </Wrapper>
  );
};
export default FriendStreak;

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.center}
  background-color: ${({ theme }) => theme.colors.translucent.navy};
  flex-direction: column;
`;

const Box = styled.div`
  position: relative;
  width: 100%;
  height: max-content;

  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};

  ::before {
    ${({ $boxStyle }) =>
      $boxStyle?.lineColor === 'gradient' &&
      css`
        content: '';
        position: absolute;
        inset: 0;
        border-radius: ${({ theme }) => theme.radius.medium};
        border: ${({ $boxStyle }) => ($boxStyle?.isBold ? '3px' : '1px')} solid
          transparent;
        background: ${({ theme }) => theme.gradient.largerPurple} border-box;
        mask:
          linear-gradient(#fff 0 0) padding-box,
          linear-gradient(#fff 0 0);
        mask-composite: exclude;
      `}
  }

  ${({ $boxStyle }) =>
    $boxStyle?.lineColor === 'gradient' ||
    css`
      border-color: ${({ theme, $boxStyle }) =>
        theme.colors.primary[$boxStyle?.lineColor]};
      border-width: ${({ $boxStyle }) => ($boxStyle?.isBold ? '3px' : '1px')};
      border-style: solid;
      border-radius: ${({ theme }) => theme.radius.medium};
    `};
`;

const UserName = styled.div`
  ${({ theme }) => theme.fonts.JuaSmall};
  color: ${({ theme }) => theme.colors.primary.white};
  margin: 10px;
`;
const SeperateLine = styled.div`
  width: 90%;
  height: 1px;
  background: ${({ theme }) => theme.colors.neutral.lightGray};
`;
