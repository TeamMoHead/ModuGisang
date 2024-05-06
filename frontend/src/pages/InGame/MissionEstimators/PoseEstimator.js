import * as pose from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

import { POSES } from './POSE_DATA';

let currentScore = 0; // 현재 점수
let maxScore = 50; // 목표 점수
let myMissionStatus = false; // 측정 결과
let isEstimated = false; // 측정 완료 여부
let selectedPose; // 선택된 자세
const keypoints = {}; // 측정에 사용할 각 포인트의 위치 저장
const timeoutDuration = 7000; // 제한 시간

export const estimatePose = ({ results, myVideoRef, canvasRef }) => {
  if (
    !myVideoRef.current ||
    !canvasRef.current ||
    !results?.poseLandmarks?.length > 0
  )
    return;

  const canvasElement = canvasRef.current;
  const canvasCtx = canvasElement.getContext('2d');
  if (canvasCtx == null) throw new Error('Could not get context');
  canvasElement.width = myVideoRef.current.videoWidth;
  canvasElement.height = myVideoRef.current.videoHeight;

  const stretchingGame = poseLandmarks => {
    if (!selectedPose) {
      selectedPose = POSES[Math.floor(Math.random() * POSES.length)];
      console.log('Selected pose:', selectedPose.name);
    }

    if (!myMissionStatus) {
      selectedPose.keypoints.forEach(keypoint => {
        keypoints[keypoint] = poseLandmarks[keypoint];
      });
      if (selectedPose && selectedPose.condition(keypoints)) {
        currentScore = Math.min(maxScore, currentScore + selectedPose.score);
      }

      console.log('currentScore:', currentScore);
    }

    if (!isEstimated) {
      setTimeout(() => {
        if (currentScore >= maxScore) {
          console.log(
            `------------POSE RESULT: ${selectedPose.name} 자세를 취했습니다.`,
          );
          myMissionStatus = true;
        } else {
          console.log('------------POSE RESULT: 자세 취하기 실패');
          myMissionStatus = false;
        }

        console.log('---------- Final Score:', currentScore);
      }, timeoutDuration);

      isEstimated = true;
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

  drawConnectors(canvasCtx, results.poseLandmarks, pose.POSE_CONNECTIONS, {
    color: '#FFFFFF',
    lineWidth: 4,
  });

  drawLandmarks(canvasCtx, results.poseLandmarks, {
    color: '#F0A000',
    radius: 2,
  });

  stretchingGame(results.poseLandmarks);

  canvasCtx.restore();

  return myMissionStatus;
};
