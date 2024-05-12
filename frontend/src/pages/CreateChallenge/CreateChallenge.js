import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, InputBox, LongBtn, Dropdown } from '../../components';
import { AccountContext, ChallengeContext } from '../../contexts';
import { challengeServices } from '../../apis/challengeServices';
import * as S from '../../styles/common';

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
        <h1>챌린지 생성</h1>

        <Dropdown
          label="챌린지 기간"
          options={durations}
          selectedValue={duration}
          onChange={e => setDuration(e.target.value)}
        />
        <InputBox
          label="챌린지 시작일"
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <InputBox
          label="기상 시간"
          type="time"
          value={wakeTime}
          onChange={e => setWakeTime(e.target.value)}
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
        />
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
