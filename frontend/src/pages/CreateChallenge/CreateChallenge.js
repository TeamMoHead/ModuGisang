import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  NavBar,
  InputBox,
  LongBtn,
  Dropdown,
  TimePicker,
  OutlineBox,
} from '../../components';
import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css'; // css import
import '../../styles/Calendar.css';
import dayjs from 'dayjs';
import { AccountContext, ChallengeContext } from '../../contexts';
import { challengeServices } from '../../apis/challengeServices';
import * as S from '../../styles/common';
import styled from 'styled-components';

const CreateChallenge = () => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
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
  console.log(hour, ' : ', minute, ' ', period);

  const durations = [
    { label: '7 days', value: 7 },
    { label: '30 days', value: 30 },
    { label: '100 days', value: 100 },
  ];

  const handleEmailChange = e => {
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
        {/* <Dropdown
          label="챌린지 기간"
          options={durations}
          selectedValue={duration}
          onChange={e => setDuration(e.target.value)}
        /> */}
        {/* <InputBox
          label="챌린지 시작일"
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <InputBox
          label="초대할 챌린지 메이트"
          type="email"
          value={emailInput}
          onChange={handleEmailChange}
        />
        <LongBtn
          btnName="친구 추가"
          onClickHandler={e => {
            checkEmail(e);
            console.log(mates);
          }}
        /> */}

        <Title>챌린지 기간</Title>

        <Title>시작 일자</Title>
        <CalendarBox
          content={
            <Calendar
              locale="ko"
              calendarType={'hebrew'}
              prev2Label={null}
              next2Label={null}
              prevLabel={<CalendarArrow> {'<'} </CalendarArrow>}
              nextLabel={<CalendarArrow> {'>'} </CalendarArrow>}
              formatDay={(locale, date) => dayjs(date).format('D')}
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

        <div>
          <h3>초대된 친구 목록: </h3>
          <ul>
            {mates.map((mate, index) => (
              <li key={index}>{mate}</li>
            ))}
          </ul>
        </div>
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
  /* ${({ theme }) => theme.flex.center}; */
`;

const Title = styled.div`
  ${({ theme }) => theme.fonts.JuaSmall}
  ${({ theme }) => theme.flex.left}
  width:100%;
  color: ${({ theme }) => theme.colors.primary.purple};
`;

const TimeBox = styled.div`
  ${({ theme }) => theme.flex.center}
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.translucent.white};
`;

const CalendarArrow = styled.div`
  ${({ theme }) => theme.fonts.JuaSmall}
  color: var(--Light, #f0f3ff);
`;
