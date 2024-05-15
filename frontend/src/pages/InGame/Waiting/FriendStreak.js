import React, { useState, useContext, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { AccountContext } from '../../../contexts';
import { StreakContent } from '../../Main/cardComponents';
import { userServices } from '../../../apis';
import useFetch from '../../../hooks/useFetch';

const FriendStreak = ({ userId, onClick }) => {
  const { fetchData } = useFetch();
  const { accessToken } = useContext(AccountContext);
  const [mateData, setMateData] = useState(null);
  console.log('id is ', userId);

  const getMateData = async userId => {
    const response = await fetchData(() =>
      userServices.getUserInfo({ accessToken, userId }),
    );
    console.log('response is ', response);
    if (response) {
      setMateData(response);
    }
  };

  useEffect(() => {
    getMateData(userId);
  }, []);
  console.log('mateDAta is ', mateData);

  return (
    <Wrapper>
      <Box>
        <UserName>{mateData.userName}</UserName>
        <SeperateLine />
        <StreakContent userData={mateData} />
      </Box>
    </Wrapper>
  );
};
export default FriendStreak;

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.center}
  background-color: ${({ theme }) => theme.colors.translucent.navy};
  flex-direction: column;
  z-index: 999;
  width: 90%;
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
