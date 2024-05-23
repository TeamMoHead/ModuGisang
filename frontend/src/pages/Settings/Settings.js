import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountContext, ChallengeContext, UserContext } from '../../contexts';
import { authServices, userServices } from '../../apis';
import useFetch from '../../hooks/useFetch';
import {
  NavBar,
  Icon,
  OutlineBox,
  LongBtn,
  InputLine,
  InputBox,
} from '../../components';
import * as S from '../../styles/common';
import styled from 'styled-components';

const Settings = () => {
  const { fetchData } = useFetch();
  const navigate = useNavigate();

  const { getMyData } = useContext(UserContext);
  const user = useContext(UserContext);
  const { challengeData } = useContext(ChallengeContext);
  const { accessToken, setAccessToken, setUserId, userId } =
    useContext(AccountContext);

  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [isAbleInput, setIsAbleInput] = useState(false);

  const handleLogOut = async () => {
    setIsLogoutLoading(true);
    const response = await fetchData(() =>
      authServices.logOutUser({ accessToken, userId }),
    );
    const { isLoading: isLogoutLoading, error: logoutError } = response;
    if (!isLogoutLoading) {
      setUserId(null);
      setAccessToken(null);
      setIsLogoutLoading(false);
      localStorage.removeItem('refreshToken');
      alert('로그아웃 되었습니다.');
      navigate('/signIn');
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
      setIsAbleInput(false); // 수정 완료 후 비활성화
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

  const handlePractice = () => {
    console.log('연습 게임으로 이동~!');
    console.log(user.myData);
  };

  const handleIsAbleInput = () => {
    if (isAbleInput) {
      setIsAbleInput(false);
    } else {
      setIsAbleInput(true);
    }
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

  useEffect(() => {
    if (accessToken && userId) {
      getMyData();
    }
  }, [challengeData]);

  useEffect(() => {
    if (user.myData.affirmation) {
      setAffirmation(user.myData.affirmation);
    }
  }, [user.myData.affirmation]);

  return (
    <>
      <NavBar />

      <S.PageWrapper>
        <OutlineBox
          boxStyle={boxStyle}
          content={
            <UserWrapper>
              <Profile src={user.myData.profile} />
              <Text>{user.myData.userName}</Text>
            </UserWrapper>
          }
        />

        <OutlineBox
          boxStyle={boxStyle}
          content={
            <AffirmationWrapper>
              <AffiramtionBox>
                <Text isColor={true}>오늘의 다짐 문구</Text>
                <EditButton onClick={handleIsAbleInput}>
                  <Icon icon="edit" iconStyle={iconStyle} />
                </EditButton>
              </AffiramtionBox>
              <InputDiv>
                <InputBox
                  value={affirmation}
                  onChange={handleAffirmationChange}
                  disabled={!isAbleInput}
                />
              </InputDiv>

              {isAbleInput ? (
                <UpdateBtnBox>
                  <UpdateBtn
                    onClick={() => {
                      handleChangeAffirmation({ accessToken, affirmation });
                    }}
                  >
                    수정하기
                  </UpdateBtn>
                </UpdateBtnBox>
              ) : null}
            </AffirmationWrapper>
          }
        />

        {/* {userId === 34 && ( */}
        <>
          <Text>챌린지 ID</Text>
          <InputLine
            label="챌린지 ID"
            type="text"
            value={challengeId}
            onChange={handleChallengeIdChange}
          />
          <Text>기상 시간</Text>

          <InputLine
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
        <LongBtn btnName="연습 게임 진행하기" onClickHandler={handlePractice} />
        <p>24.05.23 16시 invitation 카드 수정</p>
        <LogoutWrapper onClick={handleLogOut}>
          <Text>로그아웃</Text>

          <Icon
            icon="logout"
            iconStyle={{ size: 24, color: 'white', disable: true }}
          />
        </LogoutWrapper>
      </S.PageWrapper>
    </>
  );
};

export default Settings;

const UserWrapper = styled.div`
  ${({ theme }) => theme.flex.center};
  justify-content: space-evenly;
  width: 100%;
  height: 170px;
`;

const AffirmationWrapper = styled.div`
  position: relative;
  z-index: 50;
  width: 100%;
  height: 281px;
`;

const LogoutWrapper = styled.div`
  ${({ theme }) => theme.flex.center};
  font-weight: 500;
  width: 100%;
  height: 50px;
  padding: 10px;
  border: 2px solid ${({ theme }) => theme.colors.system.red};
  border-radius: 20px;
  ${({ theme }) => theme.fonts.JuaSmall};
  color: ${({ theme }) => theme.colors.primary.white};

  cursor: pointer;
`;

const AffiramtionBox = styled.div`
  ${({ theme }) => theme.flex.center};
  text-align: center;
  width: 100%;
  height: 55px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary.purple};
`;

const Profile = styled.img`
  width: 93px;
  height: 93px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary.white};
`;

const Text = styled.div`
  margin-right: 10px;
  ${({ theme }) => theme.fonts.JuaSmall};
  color: ${({ isColor, theme }) =>
    isColor ? theme.colors.primary.purple : theme.colors.primary.white};
`;

const EditButton = styled.button`
  position: absolute;
  top: 8px;
  right: 5px;
`;

const UpdateBtn = styled.button`
  width: 100px;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.primary.purple};
  color: ${({ theme }) => theme.colors.primary.white};
  border-radius: 10px;
`;

const InputDiv = styled.div`
  margin-top: 40px;
  height: 130px;

  ${({ theme }) => theme.flex.center};
  vertical-align: middle;
`;

const UpdateBtnBox = styled.div`
  ${({ theme }) => theme.flex.center};
  width: 100%;
`;

const boxStyle = {
  isBold: false,
  lineColor: 'gradient',
};

const iconStyle = {
  size: 24,
  color: 'purple',
  hoverColor: 'white',
};

const logoutStyle = {
  isBold: false,
  lineColor: 'red', // 특정 컬러이름 || 그라데이션 => 'gradient'
  // 각 박스의 background-color는 content 각 컴포넌트에서 설정
  // border-radius도 각 content에서 설정 필요
};
