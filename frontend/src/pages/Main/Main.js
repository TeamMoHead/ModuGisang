import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserContext,
  ChallengeContext,
  AccountContext,
  MediaPipeContext,
} from '../../contexts';
import useCheckTime from '../../hooks/useCheckTime';
import BottomFixContent from './cardComponents/BottomFixContent';
import {
  NavBar,
  OutlineBox,
  WarmUpModel,
  LoadingWithText,
} from '../../components';
import {
  StreakContent,
  InvitationsContent,
  CreateContent,
  ChallengeContent,
  EnterContent,
} from './cardComponents';
import { CARD_TYPES, CARD_STYLES } from './DATA';

import styled from 'styled-components';
import * as S from '../../styles/common';

const Main = () => {
  const navigate = useNavigate();

  const { accessToken, userId } = useContext(AccountContext);
  const { challengeId, getMyData } = useContext(UserContext);
  const { challengeData, setChallengeData } = useContext(ChallengeContext);
  const { isWarmUpDone } = useContext(MediaPipeContext);
  const { isTooEarly, isTooLate } = useCheckTime(challengeData?.wakeTime);

  const hasChallenge = Number(challengeId) !== -1;

  const CARD_CONTENTS = {
    streak: <StreakContent />,
    invitations: <InvitationsContent />,
    create: <CreateContent />,
    challenge: <ChallengeContent challenges={challengeData} />,
    enter: <EnterContent />,
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
      // ================== ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ ==================
      // -------------⭐️ 개발 완료 후 주석 해제 필요 ⭐️ -------------
      // ================== ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ ==================

      // if (isTooEarly) {
      //   alert('너무 일찍 오셨습니다. 10분 전부터 입장 가능합니다.');
      // } else if (
      //   isTooLate
      //   // && !attended    ========> 오늘 챌린지 참여 못한 경우
      // ) {
      //   alert('챌린지 참여 시간이 지났습니다. 내일 다시 참여해주세요.');
      // } else if (
      //   isTooLate
      //   // && attended    ========> 오늘 챌린지 참여한 경우
      // ) {
      //   alert('멋져요! 오늘의 미라클 모닝 성공! 내일 또 만나요');
      // } else {
      navigate(`/startMorning`);
      // }
    },
  };

  useEffect(() => {
    if (accessToken && userId) {
      getMyData();
    }
  }, [challengeData]);

  if (!userId || !challengeData)
    return (
      <S.LoadingWrapper>
        <LoadingWithText loadingMSG="챌린지 데이터를 가져오고 있어요" />
      </S.LoadingWrapper>
    );
  return (
    <>
      {!isWarmUpDone ? (
        <S.LoadingWrapper>
          <LoadingWithText
            loadingMSG={
              isTooLate
                ? '결과 데이터를 저장하고 있어요'
                : '게임을 위해 필요한 AI 모델을 준비하고 있어요'
            }
          />
        </S.LoadingWrapper>
      ) : (
        <>
          <NavBar />
          <S.PageWrapper>
            <CardsWrapper>
              {CARD_TYPES[hasChallenge ? 'hasChallenge' : 'noChallenge'].map(
                type => (
                  <OutlineBox
                    key={type}
                    content={CARD_CONTENTS[type]}
                    onClickHandler={CARD_ON_CLICK_HANDLERS[type]}
                    boxStyle={CARD_STYLES[type]}
                  />
                ),
              )}
            </CardsWrapper>
            <BottomFixContent
              challengeData={challengeData}
              Handler={CARD_ON_CLICK_HANDLERS}
            />
          </S.PageWrapper>
        </>
      )}
      <WarmUpModel />
    </>
  );
};

export default Main;

const CardsWrapper = styled.div`
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
  gap: 20px;
`;
