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
        className = 'active';
      } else if (formattedDate === today) {
        className = 'today';
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
`;

const StyledMyStreakCalendar = styled(Calendar)`
  width: 100%;

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus,
  .react-calendar__tile--active {
    background: none !important;
  }
`;
