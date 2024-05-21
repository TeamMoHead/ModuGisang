import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  MediaPipeContext,
  GameContext,
  OpenViduContext,
} from '../../../contexts';
import * as pose from '@mediapipe/pose';
import { MissionStarting, MissionEnding } from '../components';
import arrow from '../../../assets/arrows/arrow.svg';
import styled from 'styled-components';

const round1 = [
  { id: 0, direction: 'top', active: false },
  { id: 1, direction: 'bottom', active: false },
  { id: 2, direction: 'left', active: false },
  { id: 3, direction: 'right', active: false },
];

const round2 = [
  { id: 4, direction: 'bottom', active: false },
  { id: 5, direction: 'right', active: false },
  { id: 6, direction: 'left', active: false },
  { id: 7, direction: 'right', active: false },
];

let currentStatus; // 현재 고개를 돌린 방향
// let isCentered = false;
let isDirectionCorrect = false; // 화살표 별 측정 결과
let isMissionFinished = false;
const timeoutDuration = 27000;

const Mission3 = () => {
  const { poseModel, setIsPoseLoaded, setIsPoseInitialized } =
    useContext(MediaPipeContext);
  const {
    isMissionStarting,
    isMissionEnding,
    isMusicMuted,
    inGameMode,
    myMissionStatus,
    setMyMissionStatus,
    setIsRoundPassed,
    setGameScore,
  } = useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);

  // 화살표 세팅
  const [arrowRound, setArrowRound] = useState({
    0: round1,
    1: round2,
  });
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [currentArrowIdx, setCurrentArrowIdx] = useState(0);
  const score = useRef(0);

  const NeckGame = (poseLandmarks, direction) => {
    if (!poseLandmarks) return;

    // 각 포인트 별 위치 기록
    const nose = poseLandmarks[pose.POSE_LANDMARKS.NOSE];
    const leftEar = poseLandmarks[pose.POSE_LANDMARKS.LEFT_EAR];
    const rightEar = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_EYE];

    // ========= ⭐️⭐️⭐️ ==========
    // fps 안 나오면 해당 부분 단순화 예정
    const leftShoulder = poseLandmarks[pose.POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftMouth = poseLandmarks[pose.POSE_LANDMARKS.LEFT_RIGHT];
    const rightMouth = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_LEFT];
    const centerSholderY = (leftShoulder.y + rightShoulder.y) / 2;
    const centerMouthY = (leftMouth.y + rightMouth.y) / 2;

    // 얼굴을 해당 방향으로 돌렸는지 확인
    if (!isMissionFinished) {
      isDirectionCorrect = false;
      if (
        nose.x < leftEar.x &&
        nose.x > rightEar.x &&
        centerSholderY - centerMouthY > (centerMouthY - nose.y) * 4.7
        // isCentered
      ) {
        currentStatus = 'top';
        console.log('----- :', currentStatus);
        // isCentered = false;
      } else if (
        nose.x < leftEar.x &&
        nose.x > rightEar.x &&
        centerSholderY - centerMouthY < (centerMouthY - nose.y) * 2.0
        // isCentered
      ) {
        currentStatus = 'bottom';
        console.log('----- :', currentStatus);
        // isCentered = false;
      } else if (
        nose.x > leftEar.x &&
        nose.x > rightEar.x
        // Math.abs(leftEar.x - nose.x) >= Math.abs(rightEar.x - leftEar.x) &&
        // isCentered
      ) {
        currentStatus = 'right';
        console.log('----- :', currentStatus);
        // isCentered = false;
      } else if (
        nose.x < leftEar.x &&
        nose.x < rightEar.x
        // Math.abs(rightEar.x - nose.x) <= Math.abs(rightEar.x - leftEar.x) &&
        // isCentered
      ) {
        currentStatus = 'left';
        console.log('----- :', currentStatus);
        // isCentered = false;
      }
      // } else if (
      //   nose.x < leftEar.x &&
      //   nose.x > rightEar.x &&
      //   centerSholderY - centerMouthY < (centerMouthY - nose.y) * 4.3 &&
      //   centerSholderY - centerMouthY > (centerMouthY - nose.y) * 2.2
      //   // && nose.y > leftShoulder.y - rangeShoulderY &&
      //   // nose.y < leftShoulder.y + rangeShoulderY
      // ) {
      //   // 한 번 고개를 돌린 뒤에는 정면을 봐야 점수를 줌
      //   currentStatus = 'front';
      //   isCentered = true;
      // }

      if (
        // currentStatus === selectedDirection[0]
        currentStatus === direction
      ) {
        // 현재 상태가 다음 방향과 일치하는지 확인
        // selectedDirection.shift(); // 다음 방향으로 이동
        isDirectionCorrect = true;
      }

      return isDirectionCorrect;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setGameScore(prev => prev + score.current);
      isMissionFinished = true;
    }, timeoutDuration);
    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
  }, []);

  useEffect(() => {
    if (
      inGameMode !== 3 ||
      !myVideoRef.current ||
      !poseModel.current ||
      isMissionStarting
    ) {
      return;
    }
    const videoElement = myVideoRef.current;
    let animationFrameId;

    const handleCanPlay = () => {
      if (poseModel.current !== null) {
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
  }, [isMissionStarting, poseModel, inGameMode, myVideoRef]);

  useEffect(() => {
    if (isMissionFinished) return;
    if (!poseModel.current || isMissionStarting) return;

    const direction = arrowRound[currentRoundIdx][currentArrowIdx].direction;

    poseModel.current.onResults(results => {
      const isCorrect = NeckGame(results.poseLandmarks, direction);

      if (isCorrect) {
        setArrowRound(prevState => {
          const newState = { ...prevState };
          newState[currentRoundIdx][currentArrowIdx].active = true;
          return newState;
        });
        if (currentRoundIdx === 1 && currentArrowIdx === 3) {
          setCurrentArrowIdx(0); // 첫 번째 화살표로 초기화
          setMyMissionStatus(true); // 성공
          score.current = 20;
        } else if (currentRoundIdx === 0 && currentArrowIdx === 3) {
          score.current = 10;
          setCurrentArrowIdx(0); // 첫 번째 화살표로 초기화
          setTimeout(() => {
            setCurrentRoundIdx(currentRoundIdx + 1); // 다음 라운드로 넘어감
          }, 1000); // 1초 뒤에 실행되도록 설정
        } else {
          score.current = currentRoundIdx * 10 + (currentArrowIdx + 1) * 2.5;
          setCurrentArrowIdx(currentArrowIdx + 1); // 다음 화살표로 이동
        }
      }
    });
  }, [
    isMissionStarting,
    currentRoundIdx,
    currentArrowIdx,
    arrowRound,
    myMissionStatus,
  ]);

  useEffect(() => {
    if (!isMissionStarting) {
      if (!isMusicMuted) {
        setIsRoundPassed(true);
        setTimeout(() => setIsRoundPassed(false), 50);
      }
    }
  }, [currentArrowIdx]);

  return (
    <>
      <MissionStarting />
      {isMissionEnding && <MissionEnding />}
      {isMissionStarting || (
        <ArrowBox>
          {arrowRound[currentRoundIdx].map(({ id, direction, active }) => (
            <Arrows
              key={`${id}_${active}`}
              src={arrow}
              direction={direction}
              active={active}
              alt={id}
            />
          ))}
        </ArrowBox>
      )}
    </>
  );
};

export default Mission3;

const ArrowBox = styled.div`
  z-index: 200;

  position: absolute;
  bottom: 25px;

  width: calc(100% - 6px);
  height: 60px;
  padding: 0 10px;

  ${({ theme }) => theme.flex.between}

  background-color: ${({ theme }) => theme.colors.translucent.lightNavy};
`;

const Arrows = styled.img`
  width: 80px;
  height: 50px;
  transform: ${({ direction }) =>
    direction === 'top'
      ? 'rotate(-90deg)'
      : direction === 'bottom'
        ? 'rotate(90deg)'
        : direction === 'left'
          ? 'rotate(180deg)'
          : 'rotate(0deg)'};

  filter: ${({ active }) => (active ? 'none' : 'grayscale(100%)')};
`;
