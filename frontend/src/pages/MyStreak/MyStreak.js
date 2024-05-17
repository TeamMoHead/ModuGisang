import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, LongBtn, OutlineBox, LoadingWithText } from '../../components';
import { AccountContext, UserContext } from '../../contexts';
import { challengeServices } from '../../apis';
import { StreakContent } from '../Main/cardComponents';
import { MyChallengeContent, MyStreakCalendar } from './cardComponents';
import useFetch from '../../hooks/useFetch';

import * as S from '../../styles/common';
import styled, { css } from 'styled-components';
import { CARD_STYLES, HEADER_STYLES } from './DATA';

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
    console.log('getCallendar', response);
  };

  const handleClickOnDate = async ({ accessToken, userId, date }) => {
    const response = await fetchData(() =>
      challengeServices.getCallendarInfoByDate({ accessToken, userId, date }),
    );
  };

  useEffect(() => {
    getCallendar({ accessToken, userId, month: 5 });
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
        <ChallengeCardWrapper
          boxStyle={CARD_STYLES.myStreakChallenge}
          header={HEADER_STYLES.myStreakChallenge}
          content={<MyChallengeContent />}
        />
        <CalendarCardWrapper
          content={<MyStreakCalendar />}
          header={HEADER_STYLES.myStreakCallendar}
          boxStyle={CARD_STYLES.myStreakCallendar}
        />
      </S.PageWrapper>
    </>
  );
};

export default MyStreak;

const StreakCardWrapper = styled(OutlineBox)``;
const ChallengeCardWrapper = styled(OutlineBox)``;
const CalendarCardWrapper = styled(OutlineBox)``;
