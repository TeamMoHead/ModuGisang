import React, { useEffect, useRef, useState, useContext } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import { Holistic } from '@mediapipe/holistic';
import { estimateFace } from '../MissionEstimators/FaceEstimator';
import styled from 'styled-components';

const Mission2 = () => {
  const { myVideoRef } = useContext(GameContext);
  const canvasRef = useRef(null);
  const holisticRef = useRef(null);

  useEffect(() => {
    const videoElement = myVideoRef.current;

    holisticRef.current = new Holistic({
      locateFile: file => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    holisticRef.current.setOptions({
      selfieMode: true,
      modelComplexity: 0.5,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holisticRef.current.onResults(results =>
      estimateFace({ results, myVideoRef, canvasRef }),
    );

    const handleCanPlay = () => {
      holisticRef.current.send({ image: videoElement }).then(() => {
        requestAnimationFrame(handleCanPlay);
      });
    };

    videoElement.addEventListener('canplay', handleCanPlay);

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      holisticRef.current.close();
    };
  }, [myVideoRef]);

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
