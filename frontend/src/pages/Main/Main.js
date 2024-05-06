import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, ChallengeContext, AccountContext } from '../../contexts';
import useCheckTime from '../../hooks/useCheckTime';
import useFetch from '../../hooks/useFetch';
import { NavBar, CardBtn, SimpleBtn } from '../../components';
import {
  StreakContent,
  InvitationsContent,
  CreateContent,
  ChallengeContent,
  EnterContent,
} from './cardComponents';
import { challengeServices, userServices } from '../../apis';
import { GREETINGS, CARD_TYPES, CARD_STYLES } from './DATA';

import { TEST_USER_INFO } from './TEST_DATA';

import styled from 'styled-components';
import * as S from '../../styles/common';

const Main = () => {
  const { fetchData } = useFetch();
  const navigate = useNavigate();

  // setUserInfo는 Test용으로 사용하는 함수
  const { accessToken, userId } = useContext(AccountContext);
  const { userInfo, setUserInfo, challengeId, setChallengeId } =
    useContext(UserContext);
  const { userName } = userInfo;
  const { challengeData, setChallengeData } = useContext(ChallengeContext);
  const hasChallenge = challengeId >= 0;

  const { isTooEarly, isTooLate } = useCheckTime(challengeData?.wakeTime);

  // ---------------현재 페이지에서 쓸 State---------------
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);
  const [isChallengeInfoLoading, setIsChallengeInfoLoading] = useState(true);

  const greetings = GREETINGS[0] + userName + GREETINGS[1];

  const CARD_CONTENTS = {
    streak: <StreakContent />,
    invitations: <InvitationsContent />,
    create: <CreateContent />,
    challenge: <ChallengeContent />,
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
      navigate(`/startMorning/${challengeId}`);
      // }
    },
  };

  const getUser = async () => {
    const response = await fetchData(() =>
      userServices.getUserInfo({ accessToken, userId }),
    );
    const {
      isLoading: isUserDataLoading,
      data: userData,
      error: userDataError,
    } = response;
    console.log('userData:', userData);
    if (!isUserDataLoading && userData) {
      setUserInfo(userData);
      setChallengeId(userData.challengeId);
      console.log('challengeId', userData.challengeId);
      setIsUserInfoLoading(false);
    } else if (!isUserDataLoading && userDataError) {
      console.error(userDataError);
      setIsUserInfoLoading(false);
    }
  };

  const getChallenge = async () => {
    const response = await fetchData(() =>
      challengeServices.getChallengeInfo({
        accessToken,
        challengeId: challengeId,
      }),
    );
    const {
      isLoading: isChallengeDataLoading,
      data: challengeData,
      error: challengeDataError,
    } = response;
    console.log('challengeData:', challengeData);
    if (!isChallengeDataLoading && challengeData) {
      setChallengeData(challengeData);
      setIsChallengeInfoLoading(false);
    } else if (!isChallengeDataLoading && challengeDataError) {
      console.error(challengeDataError);
      setIsChallengeInfoLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (challengeId >= 0) {
      getChallenge();
    }
  }, [challengeId]);

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
              navigate(`/startMorning/${challengeId}`);
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
        <CardsWrapper>
          <CardBtn
            key={CARD_TYPES.invitations}
            content={CARD_CONTENTS.invitations}
            onClickHandler={CARD_ON_CLICK_HANDLERS.invitations}
            btnStyle={CARD_STYLES.invitations}
          />
        </CardsWrapper>

        <CardsWrapper>
          <CardBtn
            key={CARD_TYPES.create}
            content={CARD_CONTENTS.create}
            onClickHandler={CARD_ON_CLICK_HANDLERS.create}
            btnStyle={CARD_STYLES.create}
          />
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
