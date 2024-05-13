import React, { useEffect, useState, useContext, useRef } from 'react';
import { GameContext, OpenViduContext } from '../../../contexts';
import styled from 'styled-components';

const MateVideo = ({ mateId, mateName }) => {
  const mateVideoRef = useRef(null);
  const { mateStreams } = useContext(OpenViduContext);
  const { inGameMode, matesMissionStatus } = useContext(GameContext);
  const [thisMate, setThisMate] = useState(undefined);
  const [mateStatus, setMateStatus] = useState({
    online: false,
    missionCompleted: false,
  });

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

  return (
    <Wrapper>
      {mateStatus.online ? (
        <Video
          ref={mateVideoRef}
          autoPlay
          playsInline
          $isCompleted={mateStatus.missionCompleted}
          $isNotGame={inGameMode === 0 || inGameMode === 6}
        />
      ) : (
        <EmptyVideo>Zzz...</EmptyVideo>
      )}

      <UserName $isActive={!mateStatus.online}>{mateName}</UserName>
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
`;

const Video = styled.video`
  position: absolute;
  width: 100%;
  height: 68%;
  object-fit: cover;

  border-radius: ${({ theme }) => theme.radius.small};
  border: ${({ $isNotGame, $isCompleted, theme }) =>
    $isNotGame
      ? `3px solid ${theme.colors.primary.white}`
      : $isCompleted
        ? `3px solid ${theme.colors.primary.emerald}`
        : `3px solid ${theme.colors.system.red}`};
`;

const UserName = styled.span`
  position: fixed;
  bottom: 24px;
  width: 140%;

  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => theme.fonts.IBMsmall};
  font-size: 13px;
  text-align: center;
`;

const EmptyVideo = styled.div`
  position: absolute;
  width: 100%;
  height: 68%;

  ${({ theme }) => theme.flex.center};
  margin: auto;

  border-radius: ${({ theme }) => theme.radius.small};
  border: 3px solid ${({ theme }) => theme.colors.neutral.gray};

  background-color: ${({ theme }) => theme.colors.translucent.white};

  color: ${({ theme }) => theme.colors.neutral.gray};
  font-size: 20px;
`;
