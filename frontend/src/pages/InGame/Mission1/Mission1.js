import React, { useRef, useEffect, useContext, useState } from 'react';
import {
  MediaPipeContext,
  GameContext,
  OpenViduContext,
} from '../../../contexts';
import { MissionStarting } from '../components';
import { estimatePose } from '../MissionEstimators/PoseEstimator';
import Guide from './Guide';
import styled from 'styled-components';
import { RoundSoundEffect } from '../Sound/RoundSoundEffect';

const round = [
  {
    direction: 'left',
    active: false,
    scoreAdded: false,
  },
  {
    direction: 'right',
    active: false,
    scoreAdded: false,
  },
];

const Mission1 = () => {
  const { poseModel } = useContext(MediaPipeContext);
  const {
    isMissionStarting,
    inGameMode,
    myMissionStatus,
    setMyMissionStatus,
    gameScore,
    setGameScore,
  } = useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);
  const canvasRef = useRef(null);

  const [stretchSide, setStretchSide] = useState(round);
  const [currentRound, setCurrentRound] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (
      inGameMode !== 1 ||
      !myVideoRef.current ||
      !poseModel.current ||
      isMissionStarting
    ) {
      return;
    }

    const videoElement = myVideoRef.current;
    let animationFrameId;
    let frameCount = 0;

    const updateProgress = (result, direction) => {
      const newProgress =
        direction === 'left'
          ? result.currentScoreLeft
          : result.currentScoreRight;
      setProgress(newProgress);
    };

    poseModel.current.onResults(results => {
      frameCount++;
      const direction = stretchSide[currentRound].direction;
      const result = estimatePose({
        results,
        myVideoRef,
        canvasRef,
        direction,
      });

      // console.log('result:', result, 'direction:', direction, stretchSide);
      if (result !== undefined) {
        if (frameCount % 5 === 0) {
          requestAnimationFrame(() => updateProgress(result, direction));
        }
        if (result.isPoseCorrect) {
          setStretchSide(prevState =>
            prevState.map((item, index) =>
              index === currentRound ? { ...item, active: true } : item,
            ),
          );
        }
      }
    });

    const handleCanPlay = () => {
      if (poseModel.current) {
        poseModel.current.send({ image: videoElement }).then(() => {
          animationFrameId = requestAnimationFrame(handleCanPlay);
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
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMissionStarting, poseModel, inGameMode, myVideoRef, currentRound]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentRound(1);
    }, 11000);
  }, []);

  useEffect(() => {
    if (
      stretchSide[0].active &&
      stretchSide[1].active &&
      myMissionStatus === false
    ) {
      console.log('========미션 1 성공========');
      setMyMissionStatus(true);
    }

    stretchSide.forEach((side, index) => {
      if (side.active && !side.scoreAdded) {
        setGameScore(prevGameScore => prevGameScore + 12.5);
        console.log(gameScore);
        // 점수가 추가된 후, scoreAdded 상태 업데이트
        setStretchSide(prevState =>
          prevState.map((item, idx) =>
            idx === index ? { ...item, scoreAdded: true } : item,
          ),
        );
        RoundSoundEffect();
      }
    });
  }, [stretchSide]);

  return (
    <>
      <MissionStarting />
      {isMissionStarting || (
        <>
          <Canvas ref={canvasRef} />
          <ProgressWrapper title="progressWrapper">
            <ProgressIndicator progress={progress} />
          </ProgressWrapper>
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

const ProgressWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 50px;
  top: 100px;

  border: 3px solid ${({ theme }) => theme.colors.primary.white};
  background-color: ${({ theme }) => theme.colors.translucent.navy};
  /* border-radius: ${({ theme }) => theme.radius.light}; */
  overflow: hidden;
  /* margin: 20px 0; */
`;

const ProgressIndicator = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;

  width: ${({ progress }) => progress}%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.primary.light};
  background-color: ${({ theme }) => theme.colors.primary.emerald};
  transition: width 0.2s ease;
`;
