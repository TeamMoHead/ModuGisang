import React, { useRef, useEffect, useContext } from 'react';
import { GameContext, OpenViduContext } from '../../../contexts';
import { Pose } from '@mediapipe/pose';
import { estimatePose } from '../MissionEstimators/PoseEstimator';

import styled from 'styled-components';

const Mission1 = () => {
  const {
    inGameMode,
    myMissionStatus,
    setMyMissionStatus,
    isGameLoading,
    setIsGameLoading,
  } = useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);
  const canvasRef = useRef(null);
  const msPoseRef = useRef(null);

  useEffect(() => {
    if (inGameMode !== 1 || !myVideoRef.current) return;

    const videoElement = myVideoRef.current;

    msPoseRef.current = new Pose({
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

    msPoseRef.current.onResults(results => {
      setMyMissionStatus(estimatePose({ results, myVideoRef, canvasRef }));
      if (isGameLoading) setIsGameLoading(false);
    });

    const handleCanPlay = () => {
      if (msPoseRef.current !== null) {
        msPoseRef.current.send({ image: videoElement }).then(() => {
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
      msPoseRef.current = null;
    };
  }, []);

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
