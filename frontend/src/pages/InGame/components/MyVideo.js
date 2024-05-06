import React, { useContext, useState, useEffect } from 'react';
import { GameContext, OpenViduContext } from '../../../contexts';
import { LoadingWithText } from '../../../components';
import styled from 'styled-components';

const MyVideo = () => {
  const { myVideoRef, myStream } = useContext(OpenViduContext);
  const { missionCompleted } = useContext(GameContext);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    if (myVideoRef && myStream) {
      myStream.addVideoElement(myVideoRef.current);
    }
  }, [myStream, myVideoRef]);

  useEffect(() => {
    const handleVideoLoading = () => {
      setIsVideoLoading(false);
    };

    if (myVideoRef.current) {
      myVideoRef.current.addEventListener('playing', handleVideoLoading);
    }

    return () => {
      if (myVideoRef.current) {
        myVideoRef.current.removeEventListener('playing', handleVideoLoading);
      }
    };
  }, [myVideoRef]);

  return (
    <Wrapper>
      {isVideoLoading && (
        <LoadingWithText loadingMSG="카메라를 인식 중이에요" />
      )}
      <Video ref={myVideoRef} autoPlay playsInline />
    </Wrapper>
  );
};

export default MyVideo;

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.center}
`;

const Video = styled.video`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;
