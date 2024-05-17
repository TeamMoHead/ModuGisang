import React, { useState } from 'react';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import styled from 'styled-components';

const MyStreakCalendar = ({
  startDate,
  handleDateChange,
  challengeDates,
  handleActiveStartDateChange,
}) => {
  const [clickedDate, setClickedDate] = useState(null);

  const isChallengeDay = date => {
    return challengeDates.includes(dayjs(date).format('YYYY-MM-DD'));
  };

  const handleClickOnDate = date => {
    setClickedDate(dayjs(date).format('YYYY-MM-DD'));
    handleDateChange(date);
  };

  const tileClassName = ({ date, view }) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');

    let className = '';

    if (view === 'month') {
      if (formattedDate === clickedDate) {
        className = 'react-calendar__tile--active';
      } else if (formattedDate === today && isChallengeDay(date)) {
        className = 'react-calendar__tile--now challenge-day';
      } else if (isChallengeDay(date)) {
        className = 'challenge-day';
      }
    }
    return className;
  };

  return (
    <MyStreakCalendarWrapper>
      <StyledMyStreakCalendar
        locale="ko"
        calendarType={'hebrew'}
        prev2Label={null}
        next2Label={null}
        prevLabel={<CalendarArrow> {'<'} </CalendarArrow>}
        nextLabel={<CalendarArrow> {'>'} </CalendarArrow>}
        formatDay={(locale, date) => dayjs(date).format('D')}
        formatMonthYear={(locale, date) => dayjs(date).format('YYYY년 / M월')} // 네비게이션에서 2023년 / 12월 이렇게 보이도록 설정
        onChange={handleClickOnDate} // 바뀔 때 사용하는 함수
        value={startDate} // 해당 값 사용하는 함수
        tileClassName={tileClassName}
        onActiveStartDateChange={handleActiveStartDateChange}
      />
    </MyStreakCalendarWrapper>
  );
};

export default MyStreakCalendar;

const CalendarArrow = styled.div`
  ${({ theme }) => theme.fonts.JuaSmall}
  color: ${({ theme }) => theme.colors.primary.white};
`;

const MyStreakCalendarWrapper = styled.div`
  ${({ theme }) => theme.flex.center}
  padding: 24px;
`;

const StyledMyStreakCalendar = styled(Calendar)`
  .react-calendar__tile {
    font-size: 16px;
  }
  .challenge-day {
    border: 2px solid ${({ theme }) => theme.colors.primary.purple};
    border-radius: 100%;
    box-sizing: border-box;
  }
  .react-calendar__tile--now {
    background: ${({ theme }) => theme.colors.primary.emerald};
    color: ${({ theme }) => theme.colors.primary.white};
    border: 2px solid ${({ theme }) => theme.colors.primary.emerald};
    border-radius: 100%;
  }
  .react-calendar__tile--now.challenge-day {
    background: ${({ theme }) => theme.colors.primary.emerald};
    color: ${({ theme }) => theme.colors.primary.white} !important;
    border: 2px solid ${({ theme }) => theme.colors.primary.purple};
    border-radius: 100%;
  }
  .react-calendar__tile--active {
    border-radius: 100%;
    color: ${({ theme }) => theme.colors.primary.navy} !important;
    background-color: ${({ theme }) => theme.colors.primary.purple};
  }
`;
