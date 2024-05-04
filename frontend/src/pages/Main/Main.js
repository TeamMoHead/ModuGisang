import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../../contexts/AccountContexts';
import { ChallengeContext } from '../../contexts/ChallengeContext';
import { UserContext } from '../../contexts/UserContext';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import { isPastTime } from '../InGame/functions';
import { NavBar, CardBtn, SimpleBtn } from '../../components';
import {
  StreakContent,
  InvitationsContent,
  CreateContent,
  ChallengeContent,
  EnterContent,
} from './cardComponents';
import { GREETINGS, CARD_TYPES, CARD_STYLES } from './DATA';

import { TEST_USER_INFO } from './TEST_DATA';

import styled from 'styled-components';
import * as S from '../../styles/common';

const Main = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);
  const [isChallengeInfoLoading, setIsChallengeInfoLoading] = useState(true);
  const { fetchData } = useFetch();
  const { handleCheckAuth } = useAuth();
  const navigate = useNavigate();

  // setUserInfo는 Test용으로 사용하는 함수
  const { accessToken } = useContext(AccountContext);
  const { userInfo, setUserInfo, fetchUserData, userId, setUserId } =
    useContext(UserContext);
  const { userName, challengeId: hasChallenge } = userInfo;
  const { challengeData, setChallengeData, fetchChallengeData } =
    useContext(ChallengeContext);
  const { challengeId, wakeTime } = challengeData;

  const greetings = GREETINGS[0] + userName + GREETINGS[1];

  const CARD_CONTENTS = {
    streak: <StreakContent userInfo={userInfo} />,
    invitations: <InvitationsContent id={userId} />,
    create: <CreateContent id={userId} />,
    challenge: <ChallengeContent id={userId} data={challengeData} />,
    enter: <EnterContent id={userId} />,
  };

  const CARD_ON_CLICK_HANDLERS = {
    streak: () => navigate('/myStreak'),
    invitations: () => {
      // 초대받은 challenge 존재 여부에 따라 분기처리
      navigate('/joinChallenge');
    },
    create: () => navigate('/createChallenge'),
    challenge: null,
    enter: () => {
      // 현재 시간이 challenge 시작 시간보다 늦으면
      // or 너무 빠르면...등 분기처리 로직
      if (isPastTime(wakeTime)) {
        alert('챌린지 참여 시간이 지났습니다.');
        return;
      }
      navigate(`/startMorning/${challengeId}/waiting`);
    },
  };

  const checkAuthorize = async () => {
    setIsAuthLoading(true);
    const response = await handleCheckAuth();
    if (response) {
      setIsAuthLoading(false);
      setIsAuthorized(true);
    }
  };

  const getUserInfo = async ({ accessToken, userId }) => {
    setIsUserInfoLoading(true);
    try {
      const response = await fetchData(() =>
        fetchUserData({ accessToken, userId }),
      );
      const {
        isLoading: isUserInfoLoading,
        data: userInfoData,
        error: userInfoError,
      } = response;
      if (!isUserInfoLoading && userInfoData) {
        setUserInfo(userInfoData);
        setIsUserInfoLoading(false);
      } else if (userInfoError) {
        setIsUserInfoLoading(false);
        console.error(userInfoError);
        return;
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const getChallengeInfo = async ({ accessToken, challengeId }) => {
    setIsChallengeInfoLoading(true);
    try {
      const response = await fetchData(() =>
        fetchChallengeData({ accessToken, challengeId }),
      );
      const {
        isLoading: isChallengeInfoLoading,
        data: challengeInfoData,
        error: challengeInfoError,
      } = response;
      if (!isChallengeInfoLoading && challengeInfoData) {
        setChallengeData(challengeInfoData);
        setIsChallengeInfoLoading(false);
      } else if (challengeInfoError) {
        console.error(challengeInfoError);
        setIsChallengeInfoLoading(false);
        return;
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  useEffect(() => {
    checkAuthorize();
    console.log('checking authorization...');
    console.log('AT', accessToken);
    console.log('RT', localStorage.getItem('refreshToken'));
    console.log('UID', userId);
  }, [accessToken]);

  // useEffect(() => {
  //   console.log('getting user info...');
  //   console.log('user id is : ', userId);
  //   if (userId && isAuthorized) {
  //     getUserInfo({ userId });
  //   }
  // }, [userId, isAuthorized]);

  // useEffect(() => {
  //   if (hasChallenge && !isUserInfoLoading && isAuthorized) {
  //     getChallengeInfo({ accessToken, challengeId });
  //   } else {
  //     setIsChallengeInfoLoading(false);
  //   }
  // }, [hasChallenge, isUserInfoLoading, isAuthorized]);

  if (isAuthLoading) return <div>Loading...</div>;
  if (!isAuthorized) return <div>접근이 허용되지 않은 페이지입니다.</div>;

  return (
    <>
      <NavBar />
      <S.PageWrapper>
        <Greetings>{greetings}</Greetings>
        {TEST_USER_INFO.map(({ userId, userName }) => (
          <SimpleBtn
            key={userId}
            btnName={userId}
            onClickHandler={() => {
              setUserInfo(prev => ({ ...prev, userId, userName }));
              navigate(`/startMorning/${challengeId}/waiting`);
            }}
          />
        ))}

        <CardsWrapper>
          {CARD_TYPES[hasChallenge ? 'hasChallenge' : 'noChallenge'].map(
            type => (
              <CardBtn
                key={type}
                content={CARD_CONTENTS[type]}
                onClickHandler={CARD_ON_CLICK_HANDLERS[type]}
                btnStyle={CARD_STYLES[type]}
              />
            ),
          )}
        </CardsWrapper>
      </S.PageWrapper>
    </>
  );
};

export default Main;

const Greetings = styled.h6`
  ${({ theme }) => theme.fonts.content}
  padding: 20px 0;
`;

const CardsWrapper = styled.div`
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
  gap: 10px;
`;
