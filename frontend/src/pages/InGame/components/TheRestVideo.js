import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

const TheRestVideo = ({ thisUserStream }) => {
  const [userName, setUserName] = useState(null);
  const userVideoRef = useRef(null);

  useEffect(() => {
    if (thisUserStream) {
      setUserName(JSON.parse(thisUserStream.stream.connection.data).userName);
      thisUserStream.addVideoElement(userVideoRef.current);
    }
  }, [thisUserStream]);

  return (
    <Wrapper>
      <Video ref={userVideoRef} autoPlay playsInline />
      <UserName>{userName}</UserName>
    </Wrapper>
  );
};

export default TheRestVideo;

const Wrapper = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  display: flex;
  ${({ theme }) => theme.flex.center}
  justify-content: flex-start;
  flex-direction: column;

  box-shadow: ${({ theme }) => theme.boxShadow.basic};
`;

const Video = styled.video`
  position: absolute;
  width: 100%;
  height: 66%;
  object-fit: cover;

  border-radius: ${({ theme }) => theme.radius.small};
  border: 3px solid ${({ theme }) => theme.colors.primary.white};
`;

const UserName = styled.span`
  position: fixed;
  bottom: 23px;
  width: 140%;

  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => theme.fonts.IBMsmall};
  font-size: 13px;
  text-align: center;
`;
