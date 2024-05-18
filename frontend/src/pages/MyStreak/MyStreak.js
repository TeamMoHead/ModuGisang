import React, { useContext, useState, useEffect } from 'react';
import { NavBar, OutlineBox, LoadingWithText, LongBtn } from '../../components';
import { AccountContext, UserContext } from '../../contexts';
import { challengeServices } from '../../apis';
import { StreakContent } from '../Main/cardComponents';
import {
  MyChallengeContent,
  CalendarContent,
  ChallengeHistoryContent,
} from './cardComponents';
import useFetch from '../../hooks/useFetch';

import * as S from '../../styles/common';
import styled from 'styled-components';
import { CARD_STYLES, FOOTER_STYLES, HEADER_STYLES } from './DATA';

const MyStreak = () => {
  const { fetchData } = useFetch();
  const { accessToken, userId } = useContext(AccountContext);
  const { myData } = useContext(UserContext);

  const [isStreakLoading, setIsStreakLoading] = useState(false);
  const [challengeDates, setChallengeDates] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const getCalendar = async ({ accessToken, userId, month }) => {
    const response = await fetchData(() =>
      challengeServices.getCalendarInfo({ accessToken, userId, month }),
    );
    const {
      isLoading: isGetCalendarLoading,
      data: getCalendarData,
      error: getCalenderDataError,
    } = response;

    if (!isGetCalendarLoading && getCalendarData) {
      setChallengeDates(getCalendarData);
    } else if (!isGetCalendarLoading && getCalenderDataError) {
      console.error(getCalenderDataError);
    }
  };

  const handleClickOnDate = async ({ accessToken, userId, date }) => {
    const response = await fetchData(() =>
      challengeServices.getCalendarInfoByDate({ accessToken, userId, date }),
    );
    const {
      isLoading: isGetCalendarByDateLoading,
      data: getCalendarByDateData,
      error: getCalendarByDateError,
    } = response;
    console.log(getCalendarByDateData);
  };

  const handleActiveStartDateChange = ({ activeStartDate, view }) => {
    if (view === 'month') {
      const newMonth = activeStartDate.getMonth() + 1;
      setMonth(newMonth);
    }
  };

  useEffect(() => {
    getCalendar({ accessToken, userId, month });
    console.log(challengeDates);
  }, [month]);

  console.log('month', month);

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
          content={
            <CalendarContent
              startDate={new Date()}
              handleDateChange={date => console.log('Selected Date:', date)}
              challengeDates={challengeDates}
              handleActiveStartDateChange={handleActiveStartDateChange}
            />
          }
          header={HEADER_STYLES.myStreakCalendar}
          boxStyle={CARD_STYLES.myStreakCalendar}
          footer={FOOTER_STYLES.myStreakCalendar}
          // footerContent={<ChallengeHistoryContent />}
        />
        <LongBtn
          onClickHandler={() => {
            handleClickOnDate({ accessToken, userId, date: '2024-05-17' });
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
