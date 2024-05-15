import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../../contexts';
import { authServices, userServices } from '../../apis';
import useFetch from '../../hooks/useFetch';
import { NavBar, Icon, OutlineBox, LongBtn, InputBox } from '../../components';
import * as S from '../../styles/common';
import styled from 'styled-components';

const Settings = () => {
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const { accessToken, setAccessToken, setUserId, userId } =
    useContext(AccountContext);

  const [wakeTime, setWakeTime] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const { challengeData } = useContext(AccountContext);

  const { fetchData } = useFetch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    setIsLogoutLoading(true);
    const response = await fetchData(() =>
      authServices.logOutUser({ accessToken }),
    );
    const { isLoading: isLogoutLoading, error: logoutError } = response;
    if (!isLogoutLoading) {
      setUserId(null);
      setAccessToken(null);
      setIsLogoutLoading(false);
      localStorage.removeItem('refreshToken');
      alert('로그아웃 되었습니다.');
      navigate('/auth');
    } else if (logoutError) {
      setIsLogoutLoading(false);
      alert(logoutError);
    }
  };

  const handleAffirmationChange = e => {
    setAffirmation(e.target.value);
  };

  const handleChangeAffirmation = async () => {
    const response = await fetchData(() =>
      userServices.changeAffirmation({ accessToken, affirmation, userId }),
    );
    const {
      isLoading: isChangeAffirmationLoading,
      error: changeAffirmationError,
    } = response;
    if (!isChangeAffirmationLoading) {
      alert('변경되었습니다.');
      setAffirmation('');
    } else if (changeAffirmationError) {
      alert(changeAffirmationError);
    }
  };

  const handleWakeTimeChange = e => {
    setWakeTime(e.target.value);
  };

  const handleChallengeIdChange = e => {
    setChallengeId(e.target.value);
  };

  const handleChangeWakeTime = async () => {
    const response = await fetchData(() =>
      userServices.changeWakeTime({
        accessToken,
        wakeTime,
        userId,
        challengeId, // challengeId 추가
      }),
    );
    const { isLoading: isChangeWakeTimeLoading, error: changeWakeTimeError } =
      response;
    if (!isChangeWakeTimeLoading) {
      alert('기상 시간이 변경되었습니다.');
      // updateWakeTime(wakeTime);
      setWakeTime('');
    } else if (changeWakeTimeError) {
      alert(changeWakeTimeError);
    }
  };

  return (
    <>
      <NavBar />

      <S.PageWrapper>
        <InputBox
          label="오늘의 한마디 "
          type="text"
          value={affirmation}
          onChange={handleAffirmationChange}
        />
        <LongBtn
          btnName="오늘의 한마디 수정하기"
          onClickHandler={() => {
            handleChangeAffirmation({ accessToken, affirmation });
          }}
        />

        {/* {userId === 34 && ( */}
        <>
          <InputBox
            label="챌린지 ID"
            type="text"
            value={challengeId}
            onChange={handleChallengeIdChange}
          />
          <InputBox
            label="기상 시간"
            type="text"
            value={wakeTime}
            onChange={handleWakeTimeChange}
          />
          <LongBtn
            btnName="기상 시간 수정하기"
            onClickHandler={handleChangeWakeTime}
          />
        </>
        {/* )} */}
        <OutlineBox
          content={
            <LogoutWrapper>
              <Text>LogOut</Text>

              <Icon
                icon="logout"
                iconStyle={{ size: 24, color: 'white', disable: true }}
              />
            </LogoutWrapper>
          }
          btnStyle={{ bgColor: 'purple', color: 'white' }}
          onClickHandler={handleLogOut}
        />
      </S.PageWrapper>
    </>
  );
};

export default Settings;

const LogoutWrapper = styled.div`
  ${({ theme }) => theme.flex.center};
  font-weight: 500;
`;

const Text = styled.div`
  margin-right: 10px;
  ${({ theme }) => theme.fonts.JuaSmall};
  color: ${({ theme }) => theme.colors.system.white};
`;
