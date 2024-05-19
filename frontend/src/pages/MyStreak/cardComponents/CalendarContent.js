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
  padding: 0 24px 24px 24px;
`;

const StyledMyStreakCalendar = styled(Calendar)`
  .react-calendar__tile {
    ${({ theme }) => theme.fonts.IBMsmallBold}
    position: relative;
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus,
  .react-calendar__tile--active {
    background: none !important;
    color: none !important;
    width: auto !important;
    -webkit-backdrop-filter: none !important;
    backdrop-filter: none !important;
  }

  .challenge-day::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 33px;
    height: 33px;
    background-color: ${({ theme }) => theme.colors.primary.emerald};
    border-radius: 50%;
    transform: translate(-40%, -50%);
    z-index: -1;
  }
  .challenge-day {
    color: ${({ theme }) => theme.colors.primary.navy};
  }

  .active::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 33px;
    height: 33px;
    background-color: ${({ theme }) => theme.colors.primary.purple};
    border-radius: 50%;
    transform: translate(-40%, -50%);
    z-index: -1;
  }
  .active {
    color: ${({ theme }) => theme.colors.primary.navy};
  }

  .today::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 33px;
    height: 33px;
    background-color: ${({ theme }) => theme.colors.system.yellow};
    color: ${({ theme }) => theme.colors.primary.navy};
    border-radius: 50%;
    transform: translate(-40%, -50%);
    z-index: -1;
  }

  .today {
    background-color: ${({ theme }) => theme.colors.primary.emerald};
    color: ${({ theme }) => theme.colors.primary.navy};
  }
`;
