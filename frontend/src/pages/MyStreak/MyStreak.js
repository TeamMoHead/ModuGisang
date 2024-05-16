import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, LongBtn } from '../../components';
import { AccountContext, UserContext } from '../../contexts';
import { challengeServices } from '../../apis';
import useFetch from '../../hooks/useFetch';

import * as S from '../../styles/common';

const MyStreak = () => {
  const navigate = useNavigate();
  const { fetchData } = useFetch();
  const { accessToken, userId } = useContext(AccountContext);
  const { myData } = useContext(UserContext);
  const { userName, streakDays, medals, affirmation } = myData;

  const getCallendar = async ({ accessToken, userId, month }) => {
    const response = await fetchData(() =>
      challengeServices.getCallendarInfo({ accessToken, userId, month }),
    );
  };

  const handleClickOnDate = async ({ accessToken, userId, date }) => {
    const response = await fetchData(() =>
      challengeServices.getCallendarInfoByDate({ accessToken, userId, date }),
    );
  };

  useEffect(() => {
    getCallendar({ accessToken, userId, month: 4 });
  }, []);

  return (
    <>
      <NavBar />
      <S.PageWrapper>
        <div>유저이름: {userName}</div>
        <div>연속일수: {streakDays}</div>
        <div>금메달: {medals?.gold}</div>
        <div>은메달: {medals?.silver}</div>
        <div>동메달: {medals?.bronze}</div>
        <div>오늘의한마디: {affirmation}</div>
        <LongBtn
          onClickHandler={() => {
            handleClickOnDate({ accessToken, userId, date: '2024-05-09' });
          }}
          btnName="5월 9일 확인하기"
        />
      </S.PageWrapper>
    </>
  );
};

export default MyStreak;
