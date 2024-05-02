import React, { useRef, useEffect, useContext } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import * as pose from '@mediapipe/pose';
import { estimatePose } from '../MissionEstimators/PoseEstimator';

import styled from 'styled-components';

const Mission1 = () => {
  const { myVideoRef, inGameMode } = useContext(GameContext);
  const canvasRef = useRef(null);
  const msPoseRef = useRef(null);
  const videoElement = myVideoRef.current;

  useEffect(() => {
    console.log('Mission1 gameMode: ', inGameMode);

    if (inGameMode !== 1) return;

    msPoseRef.current = new pose.Pose({
      locateFile: file =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    msPoseRef.current.setOptions({
      modelComplexity: 1,
      selfieMode: true,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  }, [myVideoRef.current, inGameMode]);

  useEffect(() => {
    console.log('msPoseRef.current: ', msPoseRef.current);

    msPoseRef.current.onResults(results => {
      console.log('ms onResults: ', results);
      estimatePose({ results, myVideoRef, canvasRef });
    });

    const handleCanPlay = () => {
      console.log('Mission1 handleCanPlay=========');
      let frameCount = 0;
      const frameSkip = 150;

      if (frameCount % (frameSkip + 1) === 0) {
        msPoseRef.current.send({ image: videoElement }).then(() => {
          requestAnimationFrame(handleCanPlay);
        });
      }

      frameCount++;
    };

    videoElement.addEventListener('canplay', handleCanPlay);

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      msPoseRef.current.close();
    };
  }, [myVideoRef.current, inGameMode, msPoseRef.current]);

  console.log('----Mission1 Mounted----');
  return <Canvas ref={canvasRef} />;
};

export default Mission1;

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;
