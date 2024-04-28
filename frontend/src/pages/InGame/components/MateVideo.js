import React, { forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const MateVideo = forwardRef(({ name, stream, isActive }, ref) => {
  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
    }
  }, [stream, ref]);

  return (
    <Wrapper>
      <VideoSessionArea>
        <Video ref={ref} autoPlay playsInline />
        <StatusIcon isActive={isActive} />
      </VideoSessionArea>

      <UserName>{name}</UserName>
    </Wrapper>
  );
});

export default MateVideo;

const Wrapper = styled.div`
  height: 15vh;

  ${({ theme }) => theme.flex.center}
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.boxShadow.basic};
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
  right: 10px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ isActive }) => (isActive ? 'green' : 'red')};
`;

const UserName = styled.span`
  color: ${({ theme }) => theme.colors.black};
  text-shadow: ${({ theme }) => theme.boxShadow.basic};
  margin-bottom: 8px;
`;
