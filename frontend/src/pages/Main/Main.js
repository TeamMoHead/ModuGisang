import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChallengeContext } from '../../contexts/ChallengeContext';
import { UserContext } from '../../contexts/UserContext';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import { isPastTime } from '../InGame/functions';
import { NavBar, CardBtn, SimpleBtn0 } from '../../components';
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
  const { fetchData } = useFetch();
  const { handleCheckAuth } = useAuth();
  const navigate = useNavigate();

  // setUserInfo는 Test용으로 사용하는 함수
  const { userInfo, setUserInfo } = useContext(UserContext);
  const { userId, userName, streakDays, challengeId: hasChallenge } = userInfo;
  const { challengeData } = useContext(ChallengeContext);
  const { challengeId, wakeTime } = challengeData;

  const greetings = GREETINGS[0] + userName + GREETINGS[1];

  const CARD_CONTENTS = {
    streak: <StreakContent userInfo={userInfo} />,
    invitations: <InvitationsContent id={userId} />,
    create: <CreateContent id={userId} />,
    challenge: <ChallengeContent id={userId} />,
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
    try {
      const response = await fetchData(() => handleCheckAuth());
      const {
        isLoading: isAuthLoading,
        data: authData,
        error: authError,
      } = response;
      if (!isAuthLoading) {
        setIsAuthLoading(false);
        setIsAuthorized(true);
      } else if (authError) {
        setIsAuthLoading(false);
        setIsAuthorized(false);
        navigate('/auth');
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  useEffect(() => {
    checkAuthorize();
  }, []);

  if (isAuthLoading) return <div>Loading...</div>;
  if (!isAuthorized) return <div>접근이 허용되지 않은 페이지입니다.</div>;

  return (
    <>
      <NavBar />
      <S.PageWrapper>
        <Greetings>{greetings}</Greetings>
        {TEST_USER_INFO.map(({ userId, userName }) => (
          <SimpleBtn0
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
