import React, { useEffect, useContext, useState } from 'react';
import {
  MediaPipeContext,
  GameContext,
  OpenViduContext,
} from '../../../contexts';
import { POSES } from './POSE_DATA';
import { MissionStarting, MissionEnding } from '../components';
import Guide from './Guide';
import styled from 'styled-components';
import { MissionSoundEffects, RoundSoundEffect } from '../Sound';

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

let currentScoreLeft = 0; // 현재 점수
let currentScoreRight = 0; // 현재 점수
let maxScore = 115; // 목표 점수
let selectedPose; // 선택된 자세
let isGameStart = false; // 게임 시작 여부
let isTimeOut = false; // 타임 아웃 여부
let frameCount = 0; // 현재 프레임 카운트

let isPoseCorrect = false; // 자세 측정 결과
const keypoints = {}; // 측정에 사용할 각 포인트의 위치 저장
const roundDuration = 11000; // 1 라운드 시간
const timeoutDuration = 18000; // 제한 시간

const Mission1 = () => {
  const { poseModel } = useContext(MediaPipeContext);
  const {
    isMissionStarting,
    isMissionEnding,
    inGameMode,
    isMusicMuted,
    myMissionStatus,
    setMyMissionStatus,
    setIsRoundPassed,
    gameScore,
    setGameScore,
  } = useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);

  const [stretchSide, setStretchSide] = useState(round);
  const [currentRound, setCurrentRound] = useState(0);
  const [progress, setProgress] = useState(0);

  const updateProgress = direction => {
    const newProgress =
      direction === 'left'
        ? (currentScoreLeft / maxScore) * 100
        : (currentScoreRight / maxScore) * 100;
    setProgress(newProgress);
  };

  const stretchingGame = poseLandmarks => {
    if (!poseLandmarks) return;

    const handleTimeout = () => {
      isTimeOut = true;
    };

    if (!isGameStart) {
      isGameStart = true;
      setTimeout(handleTimeout, timeoutDuration);
    }

    if (!isTimeOut) {
      isPoseCorrect = false;
      const direction = stretchSide[currentRound].direction;

      selectedPose = POSES[currentRound];
      selectedPose.keypoints.forEach(keypoint => {
        keypoints[keypoint] = poseLandmarks[keypoint];
      });

      if (selectedPose && selectedPose.condition(keypoints)) {
        if (direction === 'left') {
          currentScoreLeft += selectedPose.score;
          currentScoreLeft = Math.min(currentScoreLeft, maxScore);

          if (currentScoreLeft >= maxScore) {
            isPoseCorrect = true;
          } else {
            isPoseCorrect = false;
          }
        } else if (direction === 'right') {
          currentScoreRight += selectedPose.score;
          currentScoreRight = Math.min(currentScoreRight, maxScore);

          if (currentScoreRight >= maxScore) {
            isPoseCorrect = true;
          } else {
            isPoseCorrect = false;
          }
        }
      }

      frameCount++;
      if (isPoseCorrect !== undefined) {
        if (frameCount % 5 === 0) {
          requestAnimationFrame(() => updateProgress(direction));
        }
        if (isPoseCorrect) {
          setStretchSide(prevState =>
            prevState.map((item, index) =>
              index === currentRound ? { ...item, active: true } : item,
            ),
          );
        }
      }
    }
  };

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

    poseModel.current.onResults(results => {
      if (results.poseLandmarks) {
        stretchingGame(results.poseLandmarks);
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
      setIsRoundPassed(false);
    }, roundDuration);
  }, []);

  useEffect(() => {
    if (
      stretchSide[0].active &&
      stretchSide[1].active &&
      myMissionStatus === false
    ) {
      setMyMissionStatus(true);
    }

    stretchSide.forEach((side, index) => {
      if (side.active && !side.scoreAdded) {
        setIsRoundPassed(prevState => !prevState);
        setGameScore(prevGameScore => prevGameScore + 12.5);
        // 점수가 추가된 후, scoreAdded 상태 업데이트
        setStretchSide(prevState =>
          prevState.map((item, idx) =>
            idx === index ? { ...item, scoreAdded: true } : item,
          ),
        );
      } else {
        setIsRoundPassed(prevState => prevState);
      }
    });
  }, [stretchSide]);

  return (
    <>
      <MissionStarting />
      {isMissionEnding && <MissionEnding />}

      {isMissionStarting || (
        <>
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

const ProgressWrapper = styled.div`
  z-index: 200;

  position: absolute;
  bottom: 25px;

  width: 80%;
  height: 30px;

  border-radius: ${({ theme }) => theme.radius.small};
  border: 2px solid ${({ theme }) => theme.colors.primary.white};
  background-color: ${({ theme }) => theme.colors.translucent.navy};
`;

const ProgressIndicator = styled.div`
  z-index: 300;

  position: absolute;

  width: ${({ progress }) => progress}%;
  height: 100%;

  border-radius: ${({ theme }) => theme.radius.small};

  background-color: ${({ theme }) => theme.colors.primary.emerald};
  transition: width 0.2s ease;
`;
