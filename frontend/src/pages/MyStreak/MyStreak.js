import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, LongBtn, OutlineBox, LoadingWithText } from '../../components';
import { AccountContext, UserContext } from '../../contexts';
import { challengeServices } from '../../apis';
import { StreakContent } from '../Main/cardComponents';
import useFetch from '../../hooks/useFetch';

import * as S from '../../styles/common';
import styled, { css } from 'styled-components';
import { CARD_STYLES } from '../Main/DATA';
import Calendar from 'react-calendar';

const MyStreak = () => {
  const navigate = useNavigate();
  const { fetchData } = useFetch();
  const { accessToken, userId } = useContext(AccountContext);
  const { myData } = useContext(UserContext);
  const { userName, streakDays, medals, affirmation } = myData;

  const [isStreakLoading, setIsStreakLoading] = useState(false);

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

  if (isStreakLoading) {
    return (
      <>
        <NavBar />
        <S.PageWrapper>
          <LoadingWithText loadingMSG="로딩중..." />
        </S.PageWrapper>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <S.PageWrapper>
        <StreakCardWrapper
          content={
            <StreakContent
              userData={myData}
              isWaitingRoom={false}
              showMedals={false}
            />
          }
          boxStyle={CARD_STYLES.myStreak}
        />
        <ChallengeCardWrapper boxStyle={CARD_STYLES.myStreakChallenge} />
        <CalendarCardWrapper
          content={<Calendar />}
          boxStyle={CARD_STYLES.myStreakCallendar}
        />
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

const StreakCardWrapper = styled(OutlineBox)``;
const ChallengeCardWrapper = styled(OutlineBox)``;
const CalendarCardWrapper = styled(OutlineBox)``;
