import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, CardBtn } from '../../components';
import {
  StreakContent,
  InvitationsContent,
  CreateContent,
  ChallengeContent,
  EnterContent,
} from './cardComponents';
import { GREETINGS, CARD_TYPES, CARD_STYLES } from './DATA';
import styled from 'styled-components';
import * as S from '../../styles/common';

const Main = () => {
  const navigate = useNavigate();
  // ---------------------------------
  // userInfo 받는 ContextAPI 사용하는 것으로 바꾸기
  const [hasChallenge, setHasChallenge] = useState('hasChallenge');

  const challengeId = 1234;
  const userInfo = {
    userId: 0,
    userName: '천사박경원',
    streakDays: 2,
  };
  const { userId, userName, streakDays } = userInfo;
  // ---------------------------------

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
    challenge: () => {
      // 얘는 페이지 이동 없이 그냥 고정 카드임
    },
    enter: () => {
      // 현재 시간이 challenge 시작 시간보다 늦으면
      // or 너무 빠르면...등 분기처리 로직
      navigate(`/inGame/${challengeId}`);
    },
  };

  return (
    <>
      <NavBar />
      <S.PageWrapper>
        <Greetings>{greetings}</Greetings>
        <p>Main</p>

        <CardsWrapper>
          {CARD_TYPES[hasChallenge].map(type => (
            <CardBtn
              key={type}
              content={CARD_CONTENTS[type]}
              onClickHandler={CARD_ON_CLICK_HANDLERS[type]}
              btnStyle={CARD_STYLES[type]}
            />
          ))}
        </CardsWrapper>
      </S.PageWrapper>
    </>
  );
};

export default Main;

const Greetings = styled.h6`
  font-size: 1.5rem;
`;

const CardsWrapper = styled.div`
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
  gap: 20px;
`;
