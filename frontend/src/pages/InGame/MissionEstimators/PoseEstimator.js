import * as pose from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

let newScore = 0; // 새로운 점수 변수 초기화
let prevScore = 0;
let status;

export const estimatePose = ({ results, myVideoRef, canvasRef }) => {
  if (!myVideoRef.current || !canvasRef.current) return;

  // ------성능 test용-----
  let count = 0;
  // ---------------------

  const canvasElement = canvasRef.current;
  const canvasCtx = canvasElement.getContext('2d');
  if (canvasCtx == null) throw new Error('Could not get context');
  canvasElement.width = myVideoRef.current.videoWidth;
  canvasElement.height = myVideoRef.current.videoHeight;

  const stretchingGame = poseLandmarks => {
    const leftShoulder = poseLandmarks[pose.POSE_LANDMARKS.LEFT_SHOULDER]; // 왼쪽 어깨
    const leftElbow = poseLandmarks[pose.POSE_LANDMARKS.LEFT_ELBOW]; // 왼쪽 팔꿈치
    const leftWrist = poseLandmarks[pose.POSE_LANDMARKS.LEFT_WRIST]; // 왼쪽 손목
    const rightShoulder = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_SHOULDER]; // 오른쪽 어깨
    const rightElbow = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_ELBOW]; //  오른쪽 팔꿈치
    const rightWrist = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_WRIST]; // 오른쪽 손목

    console.log('---------- leftwrist :', leftWrist);

    // 오른쪽으로 스트레칭
    if (
      leftWrist.y < leftElbow.y &&
      leftElbow.y < leftShoulder.y &&
      leftWrist.x < leftElbow.x &&
      leftElbow.x < leftShoulder.x &&
      rightWrist.y < rightElbow.y &&
      rightElbow.y < rightShoulder.y &&
      rightWrist.x < rightElbow.x &&
      rightElbow.x < rightShoulder.x &&
      leftShoulder.y < rightShoulder.y
    ) {
      status = '오른쪽으로 스트레칭! RIGHT!';
      newScore = 5; // 임시 점수
    }
    // 오른쪽 팔을 올렸을 때
    else if (
      leftWrist.y < leftElbow.y &&
      leftElbow.y < leftShoulder.y &&
      leftWrist.x > leftElbow.x &&
      leftElbow.x > leftShoulder.x &&
      rightWrist.y < rightElbow.y &&
      rightElbow.y < rightShoulder.y &&
      rightWrist.x > rightElbow.x &&
      rightElbow.x > rightShoulder.x &&
      leftShoulder.y > rightShoulder.y
    ) {
      status = '왼쪽으로 스트레칭! LEFT!';
      newScore = 10; // 임시 점수
    }
    // 팔의 상태가 변하지 않았을 때
    else {
      status = '득점 없음';
    }

    // 현재 점수와 새로운 점수를 비교하여 더 큰 값을 새로운 점수로 설정
    prevScore = Math.max(prevScore, newScore);
    console.log('---------- Score:', prevScore);
    console.log('---------- Status:', status);
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

  // ------성능 test용-----
  console.log('===Pose Estimator: ', count);
  count++;
  // ---------------------

  canvasCtx.restore();
};
