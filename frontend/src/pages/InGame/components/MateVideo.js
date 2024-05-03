import React, { useEffect, useState, useContext, useRef } from 'react';
import { OpenViduContext } from '../../../contexts';
import styled from 'styled-components';

const MateVideo = ({ mateId, mateName }) => {
  const mateVideoRef = useRef(null);
  const { mateStreams } = useContext(OpenViduContext);
  const [thisMate, setThisMate] = useState(undefined);
  const isMateOnline = thisMate?.stream.hasVideo;

  useEffect(() => {
    if (mateStreams.length > 0) {
      const thisMate = mateStreams.find(
        mate => JSON.parse(mate.stream.connection.data).userId === `${mateId}`,
      );
      setThisMate(thisMate);
    }
  }, [mateStreams]);

  useEffect(() => {
    if (isMateOnline) {
      thisMate.addVideoElement(mateVideoRef.current);
    }
  }, [thisMate]);

  return (
    <Wrapper $mateOffLine={!isMateOnline}>
      <StatusIcon $isActive={isMateOnline} />
      {isMateOnline ? (
        <Video ref={mateVideoRef} autoPlay playsInline />
      ) : (
        <EmptyVideo>Zzz...</EmptyVideo>
      )}

      <UserName $isActive={isMateOnline}>{mateName}</UserName>
    </Wrapper>
  );
};

export default MateVideo;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 15vh;

  ${({ theme }) => theme.flex.center}
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.boxShadow.basic};
  background-color: ${({ $mateOffLine, theme }) =>
    $mateOffLine ? theme.colors.lighter.light : 'transparent'};
  border-radius: ${({ theme }) => theme.radius.basic};
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;

  border-radius: ${({ theme }) => theme.radius.basic};
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
  position: absolute;
  bottom: 5px;

  padding: 5px 10px;
  border-radius: ${({ theme }) => theme.radius.basic};
  color: ${({ theme }) => theme.colors.system.black};
  background-color: ${({ theme, $isActive }) =>
    $isActive && theme.colors.system.white};
  text-shadow: ${({ theme }) => theme.boxShadow.text};
  font-weight: 800;
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
