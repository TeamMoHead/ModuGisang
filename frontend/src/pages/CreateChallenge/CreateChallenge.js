import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  NavBar,
  InputBox,
  LongBtn,
  TimePicker,
  OutlineBox,
  CustomRadio,
  CustomCalendar,
  SearchBox,
} from '../../components';
import { AccountContext, ChallengeContext } from '../../contexts';
import { challengeServices } from '../../apis/challengeServices';
import * as S from '../../styles/common';
import styled from 'styled-components';

const CreateChallenge = () => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(7);
  const [startDate, setStartDate] = useState(new Date());
  const [range, setRange] = useState([new Date(), new Date()]);
  const [wakeTime, setWakeTime] = useState('');
  const [mates, setMates] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const { accessToken, userId } = useContext(AccountContext);
  const { handleCreateChallenge } = useContext(ChallengeContext);
  const [isCreateChallengeLoading, setIsCreateChallengeLoading] =
    useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );
  const periods = ['AM', 'PM'];
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState('AM');

  const settingHour = v => {
    setHour(v);
  };
  const settingMinute = v => {
    setMinute(v);
  };
  const settingPeriod = v => {
    setPeriod(v);
  };
  // console.log(hour, ' : ', minute, ' ', period);

  const durations = [
    { label: '7일  (동메달)', value: 7 },
    { label: '30일 (은메달)', value: 30 },
    { label: '100일 (금메달)', value: 100 },
  ];
  const handleRadioChange = e => {
    setDuration(Number(e.target.value));
  };
  const handleDateChange = e => {
    const start = new Date(e);
    const end = new Date(start);
    end.setDate(start.getDate() + (duration - 1)); // 시작 날짜로부터 6일 후 (총 7일)
    setRange([start, end]);
    setStartDate(e);
  };

  const tileClassName = ({ date, view }) => {
    // 날짜 객체 비교를 위해 각각의 요소를 추출
    const start = new Date(range[0]);
    const end = new Date(start);
    end.setDate(start.getDate() + duration - 1); // 시작 날짜로부터 duration 일 후

    // 각 날짜를 "년-월-일"의 형식으로 비교하기 위해 문자열로 변환
    const startDateStr = start.toISOString().slice(0, 10);
    const endDateStr = end.toISOString().slice(0, 10);
    const dateStr = date.toISOString().slice(0, 10);

    if (view === 'month' && dateStr >= startDateStr && dateStr <= endDateStr) {
      return 'highlight'; // 해당 범위 내 날짜에 'highlight' 클래스 적용
    }
  };

  const handleEmailChange = e => {
    console.log(e.target.value);
    setEmailInput(e.target.value);
  };

  const checkEmail = async e => {
    const response = await challengeServices.checkMateAvailability({
      accessToken,
      email: emailInput,
    });
    e.preventDefault();
    if (!response.data.isEngaged) {
      setMates([...mates, emailInput]);
      setEmailInput('');
    } else if (response.data.isEngaged) {
      alert('메이트가 이미 다른 챌린지에 참여 중입니다.');
      setEmailInput('');
    }
  };

  const deleteMate = e => {};

  const canSubmit = () => {
    console.log(userId, duration, startDate, wakeTime);
    return userId && duration && startDate && wakeTime;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (canSubmit()) {
      const response = await handleCreateChallenge({
        newChallengeData: {
          hostId: userId,
          duration: Number(duration),
          startDate,
          wakeTime,
          mates,
        },
      });
      setIsCreateChallengeLoading(false);
      if (response.data) {
        alert('챌린지가 생성되었습니다.');
        navigate('/main');
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <>
      <NavBar />
      <S.PageWrapper>
        <Title>챌린지 기간</Title>
        <ChanllengeDuartion>
          <CustomRadio
            name="durations"
            content={durations}
            onChange={handleRadioChange}
            selectedValue={duration} // 추가된 prop
          />
        </ChanllengeDuartion>

        <Title>시작 일자</Title>
        <CalendarBox
          // boxStyle={boxStyle}
          content={
            // <Calendar
            //   locale="ko"
            //   calendarType={'hebrew'}
            //   prev2Label={null}
            //   next2Label={null}
            //   prevLabel={<CalendarArrow> {'<'} </CalendarArrow>}
            //   nextLabel={<CalendarArrow> {'>'} </CalendarArrow>}
            //   formatDay={(locale, date) => dayjs(date).format('D')}
            //   formatMonthYear={(locale, date) =>
            //     dayjs(date).format('YYYY년 / M월')
            //   } // 네비게이션에서 2023년 / 12월 이렇게 보이도록 설정
            //   onChange={handleDateChange}
            //   value={startDate}
            //   tileClassName={tileClassName}
            // />
            <CustomCalendar
              startDate={startDate}
              handleDateChange={handleDateChange}
              tileClassName={tileClassName}
            />
          }
        />

        <Title>기상 시간</Title>

        {/* 다이얼 시간 선택 */}
        <TimeBox>
          <TimePicker
            isList={true}
            pos={'left'}
            list={hours}
            onSelectedChange={settingHour}
          />
          <TimePicker isList={false} pos={'mid'} list={':'} />
          <TimePicker
            isList={true}
            pos={'mid'}
            list={minutes}
            onSelectedChange={settingMinute}
          />
          <TimePicker isList={false} pos={'mid'} list={'|'} />
          <TimePicker
            isList={true}
            pos={'right'}
            list={periods}
            onSelectedChange={settingPeriod}
          />
        </TimeBox>

        <Title>미라클 메이트 초대</Title>
        <SearchBox
          value={emailInput}
          onChange={handleEmailChange}
          onClickHandler={checkEmail}
        />

        <InvitedBox>
          <ul>
            {mates.map((mate, index) => (
              <InvitedMate key={index}>
                <span>o</span> {mate} <button>x</button>
              </InvitedMate>
            ))}
          </ul>
        </InvitedBox>
        <LongBtn
          type="submit"
          btnName="챌린지 생성"
          onClickHandler={handleSubmit}
          isDisabled={!canSubmit()}
        />
      </S.PageWrapper>
    </>
  );
};

export default CreateChallenge;

const CalendarBox = styled(OutlineBox)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  ${({ theme }) => theme.fonts.JuaSmall}
  ${({ theme }) => theme.flex.left}
  width:100%;
  color: ${({ theme }) => theme.colors.primary.purple};
`;

const TimeBox = styled.div`
  width: 100%;
  ${({ theme }) => theme.flex.center}
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.translucent.white};
`;

const ChanllengeDuartion = styled.div`
  width: 100%;
  ${({ theme }) => theme.flex.left};
  flex-direction: column;
  align-items: flex-start;
`;

const InvitedBox = styled.div`
  width: 100%;
  ${({ theme }) => theme.flex.left};
  flex-direction: column;
  align-items: flex-start;
`;

const InvitedMate = styled.li`
  border: 1px solid ${({ theme }) => theme.colors.primary.purple};
  padding: 10px;
  border-radius: 20px;
  margin-bottom: 12px;

  button {
    color: white;
  }
`;
