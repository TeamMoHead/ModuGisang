import React, { useRef, useEffect, useContext } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import { Holistic } from '@mediapipe/holistic';
import * as pose from '@mediapipe/pose';
import { estimatePose } from '../MissionEstimators/PoseEstimator';

import styled from 'styled-components';

const Mission3 = () => {
  const { myVideoRef, inGameMode } = useContext(GameContext);
  const canvasRef = useRef(null);
  const msPoseRef = useRef(null);

  useEffect(() => {
    console.log('Mission1 gameMode: ', inGameMode, 'video: ', myVideoRef);

    if (inGameMode !== 1) return;
    if (!myVideoRef.current) return;

    const videoElement = myVideoRef.current;

    msPoseRef.current = new pose.Pose({
      locateFile: file =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    // msPoseRef.current = new Holistic({
    //   locateFile: file => {
    //     return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    //   },
    // });

    msPoseRef.current.setOptions({
      modelComplexity: 1,
      selfieMode: true,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

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
  }, [myVideoRef.current, inGameMode]);

  console.log('----Mission3 Mounted----');
  return <Canvas ref={canvasRef} />;
};

export default Mission3;

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;
