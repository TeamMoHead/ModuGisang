import React, { useState, useEffect, useContext, useRef } from 'react';
import { GameContext, OpenViduContext } from '../../../contexts';
import useFetch from '../../../hooks/useFetch';
import { userServices } from '../../../apis';

import { LoadingWithText } from '../../../components';

import { TheRestVideo } from '../components';

import styled, { css } from 'styled-components';

const HEADER_TEXT = '오늘의 미라클 메이커';

const Result = () => {
  const { fetchData } = useFetch();
  const { mateStreams } = useContext(OpenViduContext);
  const { inGameMode, gameResults, isGameResultReceived, getGameResults } =
    useContext(GameContext);

  const theTopVideoRef = useRef(null);
  const [theTopUserVideo, setTheTopUserVideo] = useState(null);
  const [theTopUserData, setTheTopUserData] = useState(null);
  const [theRestUsers, setTheRestUsers] = useState(null);

  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    if (inGameMode === 6 && !isGameResultReceived) {
      const results = getGameResults();
      console.log('GET RESULTS 결과: ', results);
    } else return;
  }, [inGameMode, isGameResultReceived]);

  useEffect(() => {
    if (gameResults.length > 0) {
      const theTopUserId = gameResults[0].userId;
      const theTopUserInfo = fetchData(() =>
        userServices.getUserInfo(theTopUserId),
      );
      const theTopUserVideo = mateStreams.find(
        mate =>
          JSON.parse(mate.stream.connection.data).userId === `${theTopUserId}`,
      );

      setTheTopUserData(theTopUserInfo);

      setTheTopUserVideo(theTopUserVideo);

      setTheRestUsers(
        mateStreams.filter(
          mate =>
            JSON.parse(mate.stream.connection.data).userId !==
            `${theTopUserId}`,
        ),
      );
    }
  }, [gameResults]);

  useEffect(() => {
    if (theTopVideoRef && theTopUserVideo) {
      theTopUserVideo?.addVideoElement(theTopVideoRef.current);
    }
  }, [theTopUserVideo, theTopVideoRef]);

  useEffect(() => {
    const handleVideoLoading = () => {
      setIsVideoLoading(false);
    };

    if (theTopVideoRef.current) {
      theTopVideoRef.current.addEventListener('playing', handleVideoLoading);
    }

    return () => {
      if (theTopVideoRef.current) {
        theTopVideoRef.current.removeEventListener(
          'playing',
          handleVideoLoading,
        );
      }
    };
  }, [theTopVideoRef]);

  console.log('RESULT COMPONENT:: ', gameResults, mateStreams);

  if (!theTopUserData || !theRestUsers)
    return <LoadingWithText loadingMSG="결과를 불러오는 중입니다" />;
  return (
    <Wrapper>
      <Header>
        <HeaderText>{HEADER_TEXT}</HeaderText>
      </Header>
      <TheTopUserArea>
        {isVideoLoading && (
          <LoadingWithText loadingMSG="카메라를 인식 중이에요" />
        )}
        <TheTopVideo ref={theTopVideoRef} autoPlay playsInline />
        <TheTopUserInfo>
          <TheTopName>{theTopUserData?.userName}</TheTopName>
          <TheTopStreak>{theTopUserData?.streakDays}</TheTopStreak>
          {/* <TheTopMedals>{theTopUserData?.medals?.(keys).map({}=> (<Medal key={}/>))}</TheTopMedals> */}
        </TheTopUserInfo>
      </TheTopUserArea>
      <Rankings>
        {gameResults.map(({ userId, userName, score }, idx) => (
          <RankingWrapper>
            <ScoreLine>
              <RankingNum>{idx + 1}</RankingNum>
              <Score>{score}</Score>
            </ScoreLine>
            <UserProfile userId={userId} />
            <UserName>{userName}</UserName>
          </RankingWrapper>
        ))}
      </Rankings>
      {theRestUsers?.length > 0 && (
        <TheRestUsersWrapper $isSingle={theRestUsers?.length === 1}>
          {theRestUsers?.length > 0 &&
            theRestUsers?.map(({ userId, userName }) => (
              <TheRestVideo key={userId} mateId={userId} mateName={userName} />
            ))}
        </TheRestUsersWrapper>
      )}
    </Wrapper>
  );
};

export default Result;

const Wrapper = styled.div`
  position: relative;

  ${({ theme }) => theme.flex.center};
  flex-direction: column;

  width: 100%;
  height: 100%;

  ::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: ${({ theme }) => theme.radius.medium};
    border: 3px solid transparent;
    background: ${({ theme }) => theme.gradient.largerPurple} border-box;
    mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
  }
`;

const Header = styled.div`
  position: absolute;
  top: 0;

  ${({ theme }) => theme.flex.center}
  width: 100%;

  padding: 12px;
  border-radius: 30px 30px 0 0;

  ${({ theme }) => theme.fonts.JuaSmall}

  background-color: ${({ theme }) => theme.colors.primary.purple};
`;

const HeaderText = styled.header`
  margin-bottom: -5px;
`;

const TheTopUserArea = styled.div`
  position: relative;
  ${({ theme }) => theme.flex.center};

  width: 100%;
  height: 100%;
`;

const TheTopVideo = styled.video`
  position: absolute;
  top: 0;

  width: 100%;
  height: 100%;

  border-radius: ${({ theme }) => theme.radius.medium};
  border: transparent;

  object-fit: cover;
`;

const TheTopUserInfo = styled.div`
  ${({ theme }) => theme.flex.left};
  flex-direction: column;
  gap: 5px;
`;

const TheTopName = styled.span`
  ${({ theme }) => theme.fonts.JuaSmall};
`;

const TheTopStreak = styled.span`
  ${({ theme }) => theme.fonts.IBMsmall};
`;

const Rankings = styled.div`
  width: 100%;
  height: 100%;
  padding: 12px;
`;

const RankingWrapper = styled.div`
  ${({ theme }) => theme.flex.center}
`;

const ScoreLine = styled.div`
  ${({ theme }) => theme.flex.center}
`;

const RankingNum = styled.span`
  ${({ theme }) => theme.fonts.JuaSmall}
  margin-right: 12px;
`;

const Score = styled.span`
  ${({ theme }) => theme.fonts.IBMsmall}
  color: ${({ theme }) => theme.colors.primary.navy};
  font-weight: 500;
`;

const UserProfile = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary.white};
`;

const UserName = styled.span`
  ${({ theme }) => theme.fonts.IBMsmall}
  margin-left: 5px;
`;

const TheRestUsersWrapper = styled.div`
  width: 100%;
  height: 150px;

  ${({ theme, $isSingle }) =>
    $isSingle ? theme.flex.right : theme.flex.between}

  gap: 12px;
`;
