import React, { useEffect, useState, useContext } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import styled from 'styled-components';

const MateVideo = ({ mateId, mateName }) => {
  const { mateVideoRefs, mateStreams } = useContext(GameContext);
  const [mateStream, setMateStream] = useState(null);
  const [name, setName] = useState(mateName);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (mateId && !mateVideoRefs.current[mateId]) {
      mateVideoRefs.current[mateId] = React.createRef();
    }
  }, [mateId, mateVideoRefs]);

  useEffect(() => {
    if (mateStreams.length > 0) {
      const mateStream = mateStreams.find(
        stream => stream.connection.data.userId === mateId,
      );

      if (mateStream) {
        setMateStream(mateStream);
        setName(mateStream.connection.data.userName);
        setIsActive(true);
      } else {
        setMateStream(null);
        setName('');
        setIsActive(false);
      }
    }
  }, [mateStreams]);

  useEffect(() => {
    if (mateVideoRefs.current[mateId] && mateStream) {
      mateVideoRefs.current[mateId].srcObject = mateStream;
    }
  }, [mateStream, mateVideoRefs.current[mateId]]);

  return (
    <Wrapper $mateOffLine={!mateStream}>
      <VideoSessionArea>
        <StatusIcon $isActive={mateStream} />
        {mateStream ? (
          <Video ref={mateVideoRefs.current[mateId]} autoPlay playsInline />
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
