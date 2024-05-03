import React, { useContext, useEffect } from 'react';
import { OpenViduContext } from '../../../contexts';
import styled from 'styled-components';

const MyVideo = () => {
  const { myVideoRef, myStream, setMyStream } = useContext(OpenViduContext);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
    } catch (error) {
      console.error(error);
      setMyStream(null);
    }
  };

  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  useEffect(() => {
    startCamera();
  }, []);

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
