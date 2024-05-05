import React, { useContext, useState } from 'react';
import { NavBar, InputBox, SimpleBtn, Dropdown } from '../../components';
import { AccountContext, ChallengeContext, UserContext } from '../../contexts';
import { challengeServices } from '../../apis/challengeServices';
import * as S from '../../styles/common';

const CreateChallenge = () => {
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [wakeupTime, setWakeupTime] = useState('');
  const [miracleMates, setMiracleMates] = useState([]);
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

  const checkEmail = async () => {
    const response = await challengeServices.checkMateAvailability({
      accessToken,
      email: emailInput,
    });
    console.log(response);
    if (!response.data.isEngaged) {
      setMiracleMates([...miracleMates, emailInput]);
      setEmailInput('');
    } else {
      alert('Invalid email address or not available.');
    }
  };

  const canSubmit = () => {
    console.log(userId, duration, startDate, wakeupTime);
    return userId && duration && startDate && wakeupTime;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (canSubmit()) {
      await handleCreateChallenge({
        accessToken,
        newChallengeData: {
          hostId: userId,
          duration: Number(duration),
          startDate,
          wakeupTime,
          miracleMates,
        },
        setIsCreateChallengeLoading,
      });
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
          label="Duration"
          options={durations}
          selectedValue={duration}
          onChange={e => setDuration(e.target.value)}
        />
        <InputBox
          label="Start Date"
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <InputBox
          label="Wakeup Time"
          type="time"
          value={wakeupTime}
          onChange={e => setWakeupTime(e.target.value)}
        />
        <InputBox
          label="Friend's Email"
          type="email"
          value={emailInput}
          onChange={handleEmailChange}
        />
        <SimpleBtn btnName="친구 추가" onClickHandler={checkEmail} />
        <div>
          <h3>초대된 친구 목록: </h3>
          <ul>
            {miracleMates.map((mate, index) => (
              <li key={index}>{mate}</li>
            ))}
          </ul>
        </div>
        <SimpleBtn
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
