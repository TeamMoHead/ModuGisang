import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

const Thumbnail = ({ userId, stream, isActive }) => {
  return (
    <Wrapper>
      <ThumbnailContentArea>
        <UserVideo title="UserVideo" stream={stream} />
        <StatusIcon isActive={isActive} />
      </ThumbnailContentArea>
      <ThumbnailInfoArea>
        <UserName>{userId}</UserName>;
      </ThumbnailInfoArea>
    </Wrapper>
  );
};

const UserVideo = ({ stream }) => {
  let video = (
    <video
      width="100%"
      height="100%"
      ref={video => (video.srcObject = stream)}
      autoPlay
      playsInline
    />
  );
  if (stream === null) {
    video = <NoVideo />;
  }
  return <Video title="video">{video}</Video>;
};

const Wrapper = styled.div`
  width: 200px;
  height: 20%;
  border: 3px solid black;
  flex-direction: column;
  display: flex;
`;
const ThumbnailContentArea = styled.div`
  width: 100%;
  height: 80%;
  position: relative;
  display: flex;
`;
const ThumbnailInfoArea = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
`;

const UserName = styled.div``;

const Video = styled.div`
  width: 100%;
  height: 100%;
`;
const NoVideo = styled.div`
  width: 100%;
  height: 100%;
  background-color: black;
`;
const StatusIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  ${({ isActive }) =>
    isActive
      ? css`
          background: green;
        `
      : css`
          background: red;
        `}
`;

export default Thumbnail;
