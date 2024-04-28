import React, { forwardRef, useEffect } from 'react';
import styled from 'styled-components';

const MyVideo = forwardRef(({ startCamera }, ref) => {
  useEffect(() => {
    // startCamera();
  }, [ref]);

  return (
    <Wrapper>
      <Video ref={ref} autoPlay playsInline />
    </Wrapper>
  );
});

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
