import * as pose from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

let currentStatus;
let myMissionStatus = false; // 측정 결과\
let selectedDirection; // 선택된 방향
const timeoutDuration = 7000; // 제한 시간

export const estimateHead = ({ results, myVideoRef, canvasRef }) => {
  if (!myVideoRef.current || !canvasRef.current) return;

  const canvasElement = canvasRef.current;
  const canvasCtx = canvasElement.getContext('2d');
  if (canvasCtx == null) throw new Error('Could not get context');
  canvasElement.width = myVideoRef.current.videoWidth;
  canvasElement.height = myVideoRef.current.videoHeight;

  const NeckGame = poseLandmarks => {
    if (!poseLandmarks) return;

    const leftShoulder = poseLandmarks[pose.POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_SHOULDER];
    const nose = poseLandmarks[pose.POSE_LANDMARKS.NOSE];

    // 머리가 일정 범위 내에서 움직이는지 확인
    const headRangeX = Math.abs(leftShoulder.x - rightShoulder.x) * 0.3; // 어깨 간 거리의 30%로 범위 설정
    const headRangeY = Math.abs(leftShoulder.y - nose.y) * 1.5; // 어깨와 코의 y 좌표 차이에 상수를 곱하여 범위 설정

    // 머리가 일정 범위 내에서 움직이는지 확인
    if (
      nose.x > leftShoulder.x - headRangeX &&
      nose.x < rightShoulder.x + headRangeX &&
      nose.y > leftShoulder.y - headRangeY &&
      nose.y < leftShoulder.y + headRangeY
    ) {
      currentStatus = '고개를 정면으로 향했습니다.';
    } else {
      // 머리가 상하로 돌아갔는지 확인
      if (nose.y < leftShoulder.y) {
        currentStatus = '고개를 상으로 돌렸습니다.';
      } else if (nose.y > leftShoulder.y) {
        currentStatus = '고개를 하로 돌렸습니다.';
      }

      // 머리가 좌우로 돌아갔는지 확인
      if (nose.x < (leftShoulder.x + rightShoulder.x) / 2.4) {
        currentStatus = '좌';
      } else if (nose.x > (leftShoulder.x + rightShoulder.x) / 1.8) {
        currentStatus = '우';
      } else {
        currentStatus = '정면';
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

  drawConnectors(canvasCtx, results.poseLandmarks, pose.POSE_CONNECTIONS, {
    color: '#FFFFFF',
    lineWidth: 4,
  });

  drawLandmarks(canvasCtx, results.poseLandmarks, {
    color: '#F0A000',
    radius: 2,
  });

  NeckGame(results.poseLandmarks);

  canvasCtx.restore();

  return myMissionStatus;
};
