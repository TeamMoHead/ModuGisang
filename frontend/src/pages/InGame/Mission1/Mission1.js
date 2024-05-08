import React, { useRef, useEffect, useContext, useState } from 'react';
import { GameContext, OpenViduContext } from '../../../contexts';
import { Pose } from '@mediapipe/pose';
import { estimatePose } from '../MissionEstimators/PoseEstimator';
import Guide from './Guide';

import styled from 'styled-components';

let resultOne = false;

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

  const [isProcessingComplete, setIsProcessingComplete] = useState(false);

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
      if (!resultOne) {
        resultOne = estimatePose({
          results,
          myVideoRef,
          canvasRef,
          round: 1,
        });
      }
      if (resultOne) {
        const resultTwo = estimatePose({
          results,
          myVideoRef,
          canvasRef,
          round: 2,
        });
      }
      console.log('resultOne:', resultOne);
    });

    const handleCanPlay = () => {
      let frameCount = 0;
      const frameSkip = 150;

      if (frameCount % (frameSkip + 1) === 0) {
        if (msPoseRef.current !== null) {
          msPoseRef.current.send({ image: videoElement }).then(() => {
            requestAnimationFrame(handleCanPlay);
            setIsProcessingComplete(true);
          });
        }
      }

      frameCount++;
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

  return (
    <>
      <Canvas ref={canvasRef} />
      {isProcessingComplete && <Guide poseCorrect={myMissionStatus} />}
    </>
  );
};

export default Mission1;

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 1;
`;
