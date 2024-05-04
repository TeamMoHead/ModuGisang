import * as pose from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

let currentScore = 0; // 현재 점수
let maxScore = 50; // 목표 점수
let status; // 포즈 달성 여부
let isEstimaed = false; // 측정 완료 여부
let selectedPose; // 선택된 자세
const keypoints = {}; // 측정에 사용할 각 포인트의 위치 저장
const timeoutDuration = 7000; // 제한 시간

// 자세 배열 및 현재 자세
const poses = [
  {
    name: 'leftStretch', // 왼쪽으로 양팔을 뻗고 스트레칭
    keypoints: [
      pose.POSE_LANDMARKS.LEFT_SHOULDER,
      pose.POSE_LANDMARKS.LEFT_ELBOW,
      pose.POSE_LANDMARKS.LEFT_WRIST,
      pose.POSE_LANDMARKS.RIGHT_SHOULDER,
      pose.POSE_LANDMARKS.RIGHT_ELBOW,
      pose.POSE_LANDMARKS.RIGHT_WRIST,
    ],
    condition: keypoints =>
      keypoints[pose.POSE_LANDMARKS.LEFT_WRIST].y <
        keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].y &&
      keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].y <
        keypoints[pose.POSE_LANDMARKS.LEFT_SHOULDER].y &&
      keypoints[pose.POSE_LANDMARKS.LEFT_WRIST].x <
        keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].x &&
      keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].x <
        keypoints[pose.POSE_LANDMARKS.LEFT_SHOULDER].x &&
      keypoints[pose.POSE_LANDMARKS.RIGHT_WRIST].y <
        keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].y &&
      keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].y <
        keypoints[pose.POSE_LANDMARKS.RIGHT_SHOULDER].y &&
      keypoints[pose.POSE_LANDMARKS.RIGHT_WRIST].x <
        keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].x &&
      keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].x <
        keypoints[pose.POSE_LANDMARKS.RIGHT_SHOULDER].x &&
      keypoints[pose.POSE_LANDMARKS.LEFT_SHOULDER].y <
        keypoints[pose.POSE_LANDMARKS.RIGHT_SHOULDER].y,
    score: 1,
  },
  {
    name: 'rightStretch', // 오른쪽으로 양팔을 뻗고 스트레칭
    keypoints: [
      pose.POSE_LANDMARKS.LEFT_SHOULDER,
      pose.POSE_LANDMARKS.LEFT_ELBOW,
      pose.POSE_LANDMARKS.LEFT_WRIST,
      pose.POSE_LANDMARKS.RIGHT_SHOULDER,
      pose.POSE_LANDMARKS.RIGHT_ELBOW,
      pose.POSE_LANDMARKS.RIGHT_WRIST,
    ],
    condition: keypoints =>
      keypoints[pose.POSE_LANDMARKS.LEFT_WRIST].y <
        keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].y &&
      keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].y <
        keypoints[pose.POSE_LANDMARKS.LEFT_SHOULDER].y &&
      keypoints[pose.POSE_LANDMARKS.LEFT_WRIST].x >
        keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].x &&
      keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].x >
        keypoints[pose.POSE_LANDMARKS.LEFT_SHOULDER].x &&
      keypoints[pose.POSE_LANDMARKS.RIGHT_WRIST].y <
        keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].y &&
      keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].y <
        keypoints[pose.POSE_LANDMARKS.RIGHT_SHOULDER].y &&
      keypoints[pose.POSE_LANDMARKS.RIGHT_WRIST].x >
        keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].x &&
      keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].x >
        keypoints[pose.POSE_LANDMARKS.RIGHT_SHOULDER].x &&
      keypoints[pose.POSE_LANDMARKS.LEFT_SHOULDER].y >
        keypoints[pose.POSE_LANDMARKS.RIGHT_SHOULDER].y,
    score: 1,
  },
  // 다른 자세들 추가 가능
];

export const estimatePose = ({ results, myVideoRef, canvasRef }) => {
  if (!myVideoRef.current || !canvasRef.current) return;

  const canvasElement = canvasRef.current;
  const canvasCtx = canvasElement.getContext('2d');
  if (canvasCtx == null) throw new Error('Could not get context');
  canvasElement.width = myVideoRef.current.videoWidth;
  canvasElement.height = myVideoRef.current.videoHeight;

  const stretchingGame = poseLandmarks => {
    if (!selectedPose) {
      selectedPose = poses[Math.floor(Math.random() * poses.length)];
      console.log('Selected pose:', selectedPose.name);
    }

    if (!status) {
      selectedPose.keypoints.forEach(keypoint => {
        keypoints[keypoint] = poseLandmarks[keypoint];
      });
      if (selectedPose && selectedPose.condition(keypoints)) {
        currentScore = Math.min(maxScore, currentScore + selectedPose.score);
      }

      console.log('currentScore:', currentScore);
    }

    if (!isEstimaed) {
      setTimeout(() => {
        if (currentScore >= maxScore) {
          status = `${selectedPose.name} 자세를 취했습니다.`;
        } else {
          status = '자세 취하기 실패';
        }

        console.log('---------- Final Score:', currentScore);
        console.log('---------- Status:', status);
      }, timeoutDuration);

      isEstimaed = true;
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
};
