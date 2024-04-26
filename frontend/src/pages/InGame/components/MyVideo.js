import React from 'react';
import styled from 'styled-components';

const MyVideo = () => {
  return (
    <Wrapper>
      <Video />
    </Wrapper>
  );
};

export default MyVideo;

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.center}
`;
const Video = styled.video`
  width: 100%;
  height: 100%;
  background-color: black;
`;
