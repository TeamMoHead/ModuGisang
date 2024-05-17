import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import styled from 'styled-components';

const MyStreakCalendar = ({ startDate, handleDateChange, tileClassName }) => {
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
        onChange={handleDateChange} // 바뀔 때 사용하는 함수
        value={startDate} // 해당 값 사용하는 함수
        tileClassName={tileClassName} // 해당 날짜에 클래스 이름 추가해주는 함수
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
`;
