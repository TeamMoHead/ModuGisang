import React, { useRef, useEffect, useContext, useState } from 'react';
import {
  MediaPipeContext,
  GameContext,
  OpenViduContext,
} from '../../../contexts';
import { GameLoading } from '../components';
import { estimatePose } from '../MissionEstimators/PoseEstimator';
import Guide from './Guide';
import styled from 'styled-components';

const round = [
  {
    direction: 'left',
    active: false,
  },
  {
    direction: 'right',
    active: false,
  },
];

const Mission1 = () => {
  const { poseModel } = useContext(MediaPipeContext);
  const { isGameLoading, inGameMode, myMissionStatus, setMyMissionStatus } =
    useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);
  const canvasRef = useRef(null);

  const [stretchSide, setStretchSide] = useState(round);
  const [currentRound, setCurrentRound] = useState(0);

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
      const direction = stretchSide[currentRound].direction;
      const result = estimatePose({
        results,
        myVideoRef,
        canvasRef,
        direction,
      });
      if (result) {
        setStretchSide(prevState =>
          prevState.map((item, index) =>
            index === currentRound ? { ...item, active: true } : item,
          ),
        );
      }
    });

    const handleCanPlay = () => {
      if (poseModel.current) {
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

    return () => videoElement.removeEventListener('canplay', handleCanPlay);
  }, [isGameLoading, poseModel, inGameMode, myVideoRef, currentRound]);

  useEffect(() => {
    setTimeout(() => {
      if (currentRound !== 1) {
        setTimeout(() => {
          setCurrentRound(1);
        }, 2000);
      }
    }, 7000);
  }, []);

  useEffect(() => {
    if (stretchSide[0].active && stretchSide[1].active) {
      console.log('성공');
      setMyMissionStatus(true);
    }
  }, [stretchSide]);

  return (
    <>
      <GameLoading />
      {isGameLoading || (
        <>
          <Canvas ref={canvasRef} />
          <Guide poseCorrect={stretchSide[currentRound]} />
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
`;
