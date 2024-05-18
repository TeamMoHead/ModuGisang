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
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setClickedDate(formattedDate);
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
      } else if (formattedDate === today) {
        className = 'react-calendar__tile--now';
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
        formatMonthYear={(locale, date) => dayjs(date).format('YYYY년 / M월')}
        onChange={handleClickOnDate}
        value={startDate}
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
  padding: 0 24px 24px 24px;
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
    background: ${({ theme }) => theme.gradient.onlyEmerald};
    color: ${({ theme }) => theme.colors.primary.white};
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
    background: ${({ theme }) => theme.gradient.largerPurple};
  }
  .react-calendar__tile--active.react-calendar__tile--now {
    background: ${({ theme }) => theme.gradient.largerPurple} !important;
  }
`;
