import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  AccountContext,
  GameContext,
  OpenViduContext,
} from '../../../contexts';
import useFetch from '../../../hooks/useFetch';
import { inGameServices, userServices } from '../../../apis';

import { LoadingWithText } from '../../../components';

import { TheRestVideo } from '../components';

import styled, { css } from 'styled-components';

const GAME_MODE = {
  0: 'waiting',
  1: 'mission1',
  2: 'mission2',
  3: 'mission3',
  4: 'mission4',
  5: 'mission5',
  6: 'affirmation',
  7: 'result',
};

const HEADER_TEXT = '오늘의 미라클 메이커';

const Result = () => {
  const { fetchData } = useFetch();
  const { accessToken, userId: myId } = useContext(AccountContext);

  const { mateStreams, myVideoRef, myStream } = useContext(OpenViduContext);
  const { inGameMode, isGameResultReceived } = useContext(GameContext);

  const theTopVideoRef = useRef(null);

  const [gameResults, setGameResults] = useState(null);
  const [theTopUserVideo, setTheTopUserVideo] = useState(null);
  const [theTopUserData, setTheTopUserData] = useState(null);
  const [theRestUsersStream, setTheRestUsersStream] = useState(null);

  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const getGameResults = async () => {
    const response = await fetchData(() =>
      inGameServices.getGameResults({ accessToken }),
    );
    const { isLoading, data, error } = response;
    if (!isLoading && data) {
      setGameResults(data);
    } else {
      console.error('Game Results Error => ', error);
    }
  };

  const getTopUserData = async theTopUserId => {
    const response = await fetchData(() =>
      userServices.getUserInfo({ accessToken, userId: theTopUserId }),
    );
    setTheTopUserData(response.data);
  };

  useEffect(() => {
    if (myVideoRef && myStream) {
      myStream.addVideoElement(myVideoRef.current);
    }
  }, [myStream, myVideoRef]);

  useEffect(() => {
    if (GAME_MODE[inGameMode] === 'result' && !isGameResultReceived) {
      const results = getGameResults();
      console.log('GET RESULTS 결과: ', results);
    } else return;
  }, [inGameMode, isGameResultReceived]);

  useEffect(() => {
    if (gameResults?.length > 0) {
      const theTopUserId = gameResults[0].userId;
      getTopUserData(theTopUserId);

      let theRestUsersStream = mateStreams.filter(
        mate =>
          parseInt(JSON.parse(mate.stream.connection.data).userId) !==
            theTopUserId &&
          parseInt(JSON.parse(mate.stream.connection.data).userId) !== myId,
      );

      if (theTopUserId === myId) {
        setTheTopUserVideo(myStream);
        myStream.addVideoElement(theTopVideoRef.current);
      } else {
        const theTopUserVideo = mateStreams.find(
          mate =>
            parseInt(JSON.parse(mate.stream.connection.data).userId) ===
            theTopUserId,
        );
        theTopUserVideo.addVideoElement(theTopVideoRef.current);
        setTheRestUsersStream([...theRestUsersStream, myStream]);
      }
    }
  }, [gameResults]);

  useEffect(() => {
    if (theTopVideoRef && theTopUserVideo) {
      console.log('=-=-=-==-=-==---=-TOP VIDEO=-=-=-=-=-=-=--=-=-');
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

  console.log(
    '🗓️🗓️🗓️🗓️🗓️🗓️ RESULT COMPONENT:: \n',
    'GAME RESULT: ',
    gameResults,
    'TOP USER DATA: ',
    theTopUserData,
    'ORIGINAL MATE STREAMS: ',
    mateStreams,
    'FRIENDS STREAMS: ',
    theRestUsersStream,
  );

  return (
    <>
      <Wrapper $hasRest={theRestUsersStream?.length > 0}>
        <UpperArea>
          {(!theTopUserData || !theRestUsersStream) && (
            <LoadingWithText loadingMSG="결과를 불러오는 중입니다" />
          )}
          <Header>
            <HeaderText>{HEADER_TEXT}</HeaderText>
          </Header>
          <TheTopUserArea>
            {isVideoLoading && (
              <LoadingWithText loadingMSG="카메라를 인식 중이에요" />
            )}
            <TheTopVideo
              ref={theTopVideoRef}
              autoPlay
              playsInline
              $canDisplay={theTopUserData}
            />
            <TheTopUserInfo>
              <TheTopName>{theTopUserData?.userName}</TheTopName>
              <TheTopStreak>
                미라클 모닝
                <TheTopStreakDays>
                  {theTopUserData?.streakDays}
                </TheTopStreakDays>
                일차
              </TheTopStreak>
              {/* <TheTopMedals>{theTopUserData?.medals?.(keys).map({}=> (<Medal key={}/>))}</TheTopMedals> */}
            </TheTopUserInfo>
          </TheTopUserArea>
          <Rankings>
            {gameResults?.length > 0 &&
              gameResults?.map(({ userName, score }, idx) => (
                <RankingWrapper key={idx}>
                  <ScoreLine>
                    <RankingNum>{idx + 1}</RankingNum>
                    <Score>{score}</Score>
                  </ScoreLine>
                  <UserProfile
                    src={`https://api.dicebear.com/8.x/open-peeps/svg?seed=${userName}`}
                  />
                  <UserName>{userName}</UserName>
                </RankingWrapper>
              ))}
          </Rankings>
        </UpperArea>
        {theRestUsersStream?.length > 0 && (
          <>
            <TheRestUsersWrapper $isSingle={theRestUsersStream?.length === 1}>
              {theRestUsersStream?.length > 0 &&
                theRestUsersStream?.map((thisUserStream, idx) => (
                  <TheRestVideo key={idx} thisUserStream={thisUserStream} />
                ))}
            </TheRestUsersWrapper>
          </>
        )}
      </Wrapper>
      <DummyMyVideo ref={myVideoRef} />
    </>
  );
};

export default Result;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;

  overflow: hidden;
  padding: 104px 24px 30px 24px;

  ${({ $hasRest }) =>
    $hasRest &&
    css`
      display: grid;
      grid-template-rows: auto 150px;
      gap: 10px;
      padding: 104px 24px 0px 24px;
    `};
`;

const UpperArea = styled.div`
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
  height: 48px;

  padding: 12px;
  border-radius: 30px 30px 0 0;

  ${({ theme }) => theme.fonts.JuaSmall}

  background-color: ${({ theme }) => theme.colors.primary.purple};
`;

const HeaderText = styled.header`
  margin-bottom: -5px;
`;

const TheTopUserArea = styled.div`
  ${({ theme }) => theme.flex.left};

  gap: 20px;

  width: 100%;
  height: 50%;

  padding: 24px;
`;

const TheTopVideo = styled.video`
  display: ${({ $canDisplay }) => ($canDisplay ? 'block' : 'none')};

  width: 40%;
  height: 100%;

  border-radius: ${({ theme }) => theme.radius.medium};
  border: transparent;

  object-fit: cover;
`;

const TheTopUserInfo = styled.div`
  ${({ theme }) => theme.flex.left};
  align-items: flex-start;
  flex-direction: column;
  gap: 5px;
`;

const TheTopName = styled.span`
  ${({ theme }) => theme.fonts.JuaSmall};
  text-align: left;
`;

const TheTopStreak = styled.span`
  ${({ theme }) => theme.fonts.IBMsmall};
`;

const TheTopStreakDays = styled.span`
  margin: 0 5px;
  ${({ theme }) => theme.fonts.IBMMedium};
  font-size: 1.2em;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary.emerald};
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
  color: ${({ theme }) => theme.colors.primary.white};
  font-weight: 500;
`;

const UserProfile = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  object-fit: cover;
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

const DummyMyVideo = styled.video`
  display: none;
  width: 100%;
  height: 100%;
`;
