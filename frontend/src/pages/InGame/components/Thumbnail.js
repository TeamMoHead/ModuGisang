import React, { isValidElement, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

const Thumbnail = ({ userId, stream, isActive }) => {
  return (
    <Wrapper>
      <ThumbnailContentArea>
        <UserVideo title="UserVideo" stream={stream} />
        <UserStatus isActive={isActive} />
      </ThumbnailContentArea>
      <ThumbnailInfoArea>
        <UserInfo userId={userId} />
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

const UserInfo = ({ userId }) => {
  if (userId === null || userId === undefined) {
    userId = 'Unknown User';
  }
  return <UserId>{userId}</UserId>;
};

const UserStatus = ({ isActive }) => {
  return <StatusIcon isActive={isActive} />;
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
const UserId = styled.div``;
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
