import * as pose from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

import { POSES } from './POSE_DATA';

let currentScoreLeft = 0; // 현재 점수
let currentScoreRight = 0; // 현재 점수
let maxScore = 230; // 목표 점수
let selectedPose; // 선택된 자세
let isGameStart = false; // 게임 시작 여부
let isTimeOut = false; // 타임 아웃 여부

let isPoseCorrect = false; // 자세 측정 결과
const keypoints = {}; // 측정에 사용할 각 포인트의 위치 저장
const timeoutDuration = 15000; // 제한 시간
const resultDuration = 8000; // 결과 표시 시간

export const estimatePose = ({ results, myVideoRef, canvasRef, direction }) => {
  if (
    !myVideoRef.current ||
    !canvasRef.current ||
    !results?.poseLandmarks?.length > 0
  ) {
    return;
  }

  const canvasElement = canvasRef.current;
  const canvasCtx = canvasElement.getContext('2d');
  if (canvasCtx == null) throw new Error('Could not get context');
  canvasElement.width = myVideoRef.current.videoWidth;
  canvasElement.height = myVideoRef.current.videoHeight;

  const stretchingGame = poseLandmarks => {
    if (!poseLandmarks) return;

    const handleTimeout = () => {
      isTimeOut = true;
      console.log('---------- 제한 시간 종료!');
    };

    if (!isGameStart) {
      isGameStart = true;
      setTimeout(handleTimeout, timeoutDuration);
      console.log('---------- 제한 시간 시작!');
    }

    if (!isTimeOut) {
      isPoseCorrect = false;
      if (direction === 'left') {
        selectedPose = POSES[0];
        selectedPose.keypoints.forEach(keypoint => {
          keypoints[keypoint] = poseLandmarks[keypoint];
        });

        if (selectedPose && selectedPose.condition(keypoints)) {
          currentScoreLeft = currentScoreLeft + selectedPose.score;
        }

        // console.log('currentScoreLeft:', currentScoreLeft);

        if (currentScoreLeft >= maxScore) {
          // console.log(
          //   `------------POSE RESULT: ${selectedPose.name} 자세를 취했습니다.`,
          // );
          isPoseCorrect = true;
        } else {
          // console.log('------------POSE RESULT: 자세 취하기 실패');
          isPoseCorrect = false;
        }
      }
      if (direction === 'right') {
        selectedPose = POSES[1];

        selectedPose.keypoints.forEach(keypoint => {
          keypoints[keypoint] = poseLandmarks[keypoint];
        });

        if (selectedPose && selectedPose.condition(keypoints)) {
          currentScoreRight = currentScoreRight + selectedPose.score;

          // console.log('currentScoreRight:', currentScoreRight);

          if (currentScoreRight >= maxScore) {
            // console.log(
            //   `------------POSE RESULT: ${selectedPose.name} 자세를 취했습니다.`,
            // );
            isPoseCorrect = true;
          } else {
            // console.log('------------POSE RESULT: 자세 취하기 실패');
            isPoseCorrect = false;
          }
        }
      }
    }
  };

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height,
  );

  // drawConnectors(canvasCtx, results.poseLandmarks, pose.POSE_CONNECTIONS, {
  //   color: '#FFFFFF',
  //   lineWidth: 4,
  // });

  // drawLandmarks(canvasCtx, results.poseLandmarks, {
  //   color: '#F0A000',
  //   radius: 2,
  // });

  stretchingGame(results.poseLandmarks);
  canvasCtx.restore();
  return isPoseCorrect;
};
