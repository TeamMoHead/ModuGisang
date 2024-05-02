import React, { useEffect, useState, useContext, useRef } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import styled from 'styled-components';

const MateVideo = ({ mateId, mateName }) => {
  const { mateStreams } = useContext(GameContext);
  const [name, setName] = useState(mateName);
  const mateVideoRef = useRef(null);

  useEffect(() => {
    if (mateStreams.length > 0) {
      const thisMate = mateStreams.find(
        sub => sub.connection.data.userId === mateId,
      );
      setName(thisMate.connection.data.userName);

      if (thisMate && mateVideoRef.current) {
        thisMate.addVideoElement(mateVideoRef.current);
      }
    }
  }, [mateStreams, mateId]);

  console.log('Mate Video: ', mateId, mateStreams, mateVideoRef.current);
  return (
    <Wrapper $mateOffLine={!mateVideoRef.current}>
      <VideoSessionArea>
        <StatusIcon $isActive={mateVideoRef.current} />
        {mateVideoRef.current ? (
          <Video ref={mateVideoRef.current} autoPlay playsInline />
        ) : (
          <EmptyVideo>Zzz...</EmptyVideo>
        )}
      </VideoSessionArea>

      <UserName>{name}</UserName>
    </Wrapper>
  );
};

export default MateVideo;

const Wrapper = styled.div`
  width: 100%;
  height: 15vh;

  ${({ theme }) => theme.flex.center}
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.boxShadow.basic};
  background-color: ${({ $mateOffLine, theme }) =>
    $mateOffLine ? theme.colors.lighter.light : 'none'};
  border-radius: ${({ theme }) => theme.radius.basic};
`;

const VideoSessionArea = styled.div`
  width: 100%;
  height: 80%;
  position: relative;
  display: flex;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StatusIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 15px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.system.green : theme.colors.system.red};
`;

const UserName = styled.span`
  color: ${({ theme }) => theme.colors.system.black};
  text-shadow: ${({ theme }) => theme.boxShadow.basic};
  margin-bottom: 8px;
`;

const EmptyVideo = styled.div`
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.flex.center};
  color: ${({ theme }) => theme.colors.text.gray};
  font-size: 20px;
  margin: auto;
`;
