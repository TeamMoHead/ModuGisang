import React, { useRef, useEffect, useContext } from 'react';
import {
  MediaPipeContext,
  GameContext,
  OpenViduContext,
} from '../../../contexts';
import { GameLoading } from '../components';
import { estimatePose } from '../MissionEstimators/PoseEstimator';
import Guide from './Guide';

import styled from 'styled-components';

const Mission1 = () => {
  const { poseModel } = useContext(MediaPipeContext);
  const { isGameLoading, inGameMode, myMissionStatus, setMyMissionStatus } =
    useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (
      inGameMode !== 1 ||
      !myVideoRef.current ||
      !poseModel.current ||
      isGameLoading
    ) {
      return;
    }
    const videoElement = myVideoRef.current;

    poseModel.current.onResults(results => {
      setMyMissionStatus(estimatePose({ results, myVideoRef, canvasRef }));

      // if (!resultOne) {
      //   resultOne = estimatePose({
      //     results,
      //     myVideoRef,
      //     canvasRef,
      //     round: 1,
      //   });
      // }
      // if (resultOne) {
      //   const resultTwo = estimatePose({
      //     results,
      //     myVideoRef,
      //     canvasRef,
      //     round: 2,
      //   });
      // }
    });

    const handleCanPlay = () => {
      if (poseModel.current !== null) {
        poseModel.current.send({ image: videoElement }).then(() => {
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
    };
  }, [isGameLoading, poseModel]);

  return (
    <>
      <GameLoading />
      {isGameLoading || (
        <>
          <Guide poseCorrect={myMissionStatus} />
          <Canvas ref={canvasRef} />
        </>
      )}
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
