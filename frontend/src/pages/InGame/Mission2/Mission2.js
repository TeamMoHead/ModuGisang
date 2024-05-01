import React, { useEffect, useRef, useState, useContext } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import { Holistic, FACEMESH_TESSELATION } from '@mediapipe/holistic';
import { drawConnectors } from '@mediapipe/drawing_utils';

import { estimateFace } from '../MissionEstimators/FaceEstimator';
import styled from 'styled-components';

const Mission2 = () => {
  const { myVideoRef, inGameMode } = useContext(GameContext);
  const canvasRef = useRef(null);
  const holisticRef = useRef(null);

  useEffect(() => {
    console.log('Mission2 gameMode: ', inGameMode);

    if (inGameMode !== 2) return;

    const videoElement = myVideoRef.current;

    holisticRef.current = new Holistic({
      locateFile: file => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    holisticRef.current.setOptions({
      selfieMode: true,
      modelComplexity: 0,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holisticRef.current.onResults(results => {
      estimateFace({ results, myVideoRef, canvasRef });
    });

    const handleCanPlay = () => {
      console.log('Mission2 handleCanPlay=========');
      let frameCount = 0;
      const frameSkip = 150;

      if (frameCount % (frameSkip + 1) === 0) {
        holisticRef.current.send({ image: videoElement }).then(() => {
          requestAnimationFrame(handleCanPlay);
        });
      }

      frameCount++;
    };

    videoElement.addEventListener('canplay', handleCanPlay);
    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      holisticRef.current.close();
    };
  }, [myVideoRef.current, inGameMode]);

  console.log('----Mission2 Mounted----');
  return <Canvas ref={canvasRef} />;
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
