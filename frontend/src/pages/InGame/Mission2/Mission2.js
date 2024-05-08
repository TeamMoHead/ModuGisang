import React, { useEffect, useRef, useContext } from 'react';
import {
  MediaPipeContext,
  GameContext,
  OpenViduContext,
} from '../../../contexts';

// import * as face from '@mediapipe/face_mesh';
import { GameLoading } from '../components';

import { estimateFace } from '../MissionEstimators/FaceEstimator';
import styled from 'styled-components';

const Mission2 = () => {
  const { holisticModel } = useContext(MediaPipeContext);
  const { isGameLoading, inGameMode, myMissionStatus, setMyMissionStatus } =
    useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (
      inGameMode !== 2 ||
      !myVideoRef.current ||
      !holisticModel.current ||
      isGameLoading
    )
      return;

    const videoElement = myVideoRef.current;

    // Face만 탐지하는데도 현재 holistic를 쓰고 있습니다 (사유: 라인 그리기, 인덱싱)
    // faceRef.current = new face.FaceMesh({
    //   locateFile: file => {
    //     return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    //   },
    // });

    holisticModel.current.onResults(results => {
      estimateFace({ results, myVideoRef, canvasRef });
    });

    const handleCanPlay = () => {
      if (holisticModel.current !== null) {
        holisticModel.current.send({ image: videoElement }).then(() => {
          requestAnimationFrame(handleCanPlay);
        });
      }
    };

    if (videoElement.readyState >= 3) {
      handleCanPlay();
    } else {
      videoElement.addEventListener('canplay', handleCanPlay);
    }

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      holisticModel.current = null;
    };
  }, [isGameLoading, holisticModel]);

  return (
    <>
      <GameLoading />
      {isGameLoading || <Canvas ref={canvasRef} />}
    </>
  );
};

export default Mission2;

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;
