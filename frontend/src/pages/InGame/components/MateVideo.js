import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  AccountContext,
  GameContext,
  OpenViduContext,
} from '../../../contexts';
import { userServices } from '../../../apis';
import useFetch from '../../../hooks/useFetch';
import styled from 'styled-components';
import { css } from '@emotion/react';

const MateVideo = ({ mateId, mateName, onClick }) => {
  const { fetchData } = useFetch();
  const mateVideoRef = useRef(null);
  const { accessToken } = useContext(AccountContext);
  const { mateStreams } = useContext(OpenViduContext);
  const { inGameMode, matesMissionStatus } = useContext(GameContext);
  const [thisMate, setThisMate] = useState(undefined);
  const [mateStatus, setMateStatus] = useState({
    online: false,
    missionCompleted: false,
  });
  const [mateData, setMateData] = useState(null);

  const getMateData = async ({ mateId: userId }) => {
    const response = await fetchData(() =>
      userServices.getUserInfo({ accessToken, userId }),
    );
    setMateData(response.data);
  };

  useEffect(() => {
    if (mateId !== -1 && mateId === undefined) return;
    getMateData({ mateId });
  }, [mateId]);

  useEffect(() => {
    if (mateStreams.length > 0) {
      const thisMate = mateStreams.find(
        mate => JSON.parse(mate.stream.connection.data).userId === `${mateId}`,
      );
      if (thisMate) {
        setThisMate(thisMate);
        setMateStatus(prev => ({ ...prev, online: thisMate?.stream.hasVideo }));
      } else {
        setThisMate(null);
        setMateStatus(prev => ({ ...prev, online: false }));
      }
    } else {
      setThisMate(null);
      setMateStatus(prev => ({ ...prev, online: false }));
    }
  }, [mateStreams]);

  useEffect(() => {
    if (mateStatus.online) {
      thisMate.addVideoElement(mateVideoRef.current);
    }
  }, [thisMate]);

  useEffect(() => {
    if (matesMissionStatus[mateId]) {
      setMateStatus(prev => ({
        ...prev,
        missionCompleted: matesMissionStatus[mateId].missionCompleted,
      }));
    }
  }, [matesMissionStatus]);

  console.log(mateData?.streakDays > 100, '=====', inGameMode === 0);
  return (
    <Wrapper onClick={onClick} $isWaitingRoom={inGameMode === 0}>
      {mateStatus.online ? (
        <Video
          ref={mateVideoRef}
          autoPlay
          playsInline
          $isCompleted={mateStatus.missionCompleted}
          $isNotGame={inGameMode === 0 || inGameMode === 6}
          $isWaitingRoom={inGameMode === 0}
          $isHighStreak={mateData?.streakDays > 100}
        />
      ) : (
        <EmptyVideo>Zzz...</EmptyVideo>
      )}

      <UserName>{mateName}</UserName>
    </Wrapper>
  );
};

export default MateVideo;

const Wrapper = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  display: flex;
  ${({ theme }) => theme.flex.center}
  justify-content: flex-start;
  flex-direction: column;

  box-shadow: ${({ theme }) => theme.boxShadow.basic};

  border-radius: ${({ theme }) => theme.radius.small};
`;

const Video = styled.video`
  z-index: 100;
  position: absolute;
  width: 100%;
  height: 66%;
  object-fit: cover;

  border-radius: ${({ theme }) => theme.radius.small};
  border: ${({ $isNotGame, $isCompleted, theme }) =>
    $isNotGame
      ? `3px solid ${theme.colors.primary.white}`
      : $isCompleted
        ? `3px solid ${theme.colors.primary.emerald}`
        : `3px solid ${theme.colors.system.red}`};

  animation: ${({ $isHighStreak, $isWaitingRoom }) =>
    $isHighStreak &&
    $isWaitingRoom &&
    `emerald-glow 2s infinite alternate ease-in-out`};

  @keyframes emerald-glow {
    0% {
      box-shadow: 2px 3px 5px rgba(21, 245, 185, 0.5);
    }
    50% {
      box-shadow: 3px 6px 8px rgba(21, 245, 185, 0.8);
    }
    100% {
      box-shadow: 2px 3px 5px rgba(21, 245, 185, 0.5);
    }
  }
  // mirror mode
  will-change: transform;
  transform: rotateY(180deg) translateZ(0);
  -webkit-transform: rotateY(180deg);
`;

const UserName = styled.span`
  position: fixed;
  bottom: 23px;
  width: 140%;

  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => theme.fonts.IBMsmall};
  font-size: 13px;
  text-align: center;
`;

const EmptyVideo = styled.div`
  position: absolute;
  width: 100%;
  height: 66%;
  ${({ theme }) => theme.flex.center};
  margin: auto;

  border-radius: ${({ theme }) => theme.radius.small};
  border: 3px solid ${({ theme }) => theme.colors.neutral.gray};

  background-color: ${({ theme }) => theme.colors.translucent.white};

  color: ${({ theme }) => theme.colors.neutral.gray};
  font-size: 20px;
`;
