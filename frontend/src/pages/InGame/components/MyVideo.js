import React, { useContext, useEffect } from 'react';
import { OpenViduContext } from '../../../contexts';
import styled from 'styled-components';

const MyVideo = () => {
  const { myVideoRef, myStream } = useContext(OpenViduContext);

  useEffect(() => {
    if (myVideoRef && myStream) {
      myStream.addVideoElement(myVideoRef.current);
    }
  }, [myStream, myVideoRef]);

  return (
    <Wrapper>
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

  will-change: transform;
  transform: rotateY(180deg) translateZ(0);
  -webkit-transform: rotateY(180deg);
`;
