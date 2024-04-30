import React, { useContext, useEffect } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import {
  Mission1,
  Mission2,
  Mission3,
  Mission4,
  Affirmation,
  Result,
} from '../';
import styled from 'styled-components';

const GAME_MODE_COMPONENTS = {
  1: <Mission1 />,
  2: <Mission2 />,
  3: <Mission3 />,
  4: <Mission4 />,
  5: <Affirmation />,
  6: <Result />,
};

const MyVideo = () => {
  const { myVideoRef, myStream, setMyStream, inGameMode } =
    useContext(GameContext);

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
    // startCamera();
  }, []);

  return (
    <Wrapper>
      <Video ref={myVideoRef} autoPlay playsInline />
      {GAME_MODE_COMPONENTS[inGameMode]}
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
