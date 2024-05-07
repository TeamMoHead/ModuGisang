import * as pose from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

let currentStatus; // 현재 고개를 돌린 방향
let myMissionStatus = false; // 측정 결과
const rotateDirections = ['상', '하', '좌', '우']; // 회전 방향 배열
const numberDirections = 8; // 선택할 방향 수
let selectedDirection = ['좌', '우', '좌', '상', '하', '우', '하', '상']; // 시도해야 할 방향 목록
const timeoutDuration = 10000; // 총 제한 시간
let isTimeOut = false; // 타임 아웃 여부
let isEstimated = false; // 측정 완료 여부

let currentSuccessCount = 0; // 성공 횟수 카운트
let isGameStart = false; // 게임 시작 여부

export const estimateHead = ({ results, myVideoRef, canvasRef }) => {
  if (!myVideoRef.current || !canvasRef.current) return;

  const canvasElement = canvasRef.current;
  const canvasCtx = canvasElement.getContext('2d');
  if (canvasCtx == null) throw new Error('Could not get context');
  canvasElement.width = myVideoRef.current.videoWidth;
  canvasElement.height = myVideoRef.current.videoHeight;

  const NeckGame = poseLandmarks => {
    if (!poseLandmarks) return;

    // 각 포인트 별 위치 기록
    const leftShoulder = poseLandmarks[pose.POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_SHOULDER];
    const nose = poseLandmarks[pose.POSE_LANDMARKS.NOSE];
    const leftEar = poseLandmarks[pose.POSE_LANDMARKS.LEFT_EAR];
    const rightEar = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_EYE];
    const leftMouth = poseLandmarks[pose.POSE_LANDMARKS.LEFT_RIGHT];
    const rightMouth = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_LEFT];

    console.log('------ pose.POSE_LANDMARKS:', pose.POSE_LANDMARKS);
    console.log('------ leftMouth:', leftMouth);
    console.log('------ rightMouth:', rightMouth);

    const centerSholderY = (leftShoulder.y + rightShoulder.y) / 2;
    const centerMouthY = (leftMouth.y + rightMouth.y) / 2;

    // 머리가 일정 범위 내에서 움직이는지 확인
    const rangeShoulderX = Math.abs(leftShoulder.x - rightShoulder.x) * 0.3; // 어깨 간 거리의 30%로 범위 설정
    const rangeShoulderY = Math.abs(leftShoulder.y - nose.y) * 1.5; // 어깨와 코의 y 좌표 차이에 상수를 곱하여 범위 설정

    // 정해진 시간이 지나면 타임아웃
    const handleTimeout = () => {
      isTimeOut = true;
      console.log('---------- 시간 초과! 게임 종료!');
    };

    // 1. 얼굴을 상, 하, 좌, 우 중 어느 쪽으로 돌려야 할지 미리 정한다.
    // 어느 방향으로 돌릴지 선택
    if (selectedDirection.length === 0 && !isGameStart) {
      isGameStart = true; // 여러 번 안 넣도록 임시 안전 장치... 동시성 문제 없으려나?

      // ============= 특정 순서만 출력하도록 변경되어 주석 처리
      // 8번 반복하여 방향을 랜덤하게 선택하여 리스트에 추가
      // for (let i = 0; i < numberDirections; i++) {
      //   const randomDirectionIndex = Math.floor(Math.random() * 4); // 0부터 3까지의 랜덤한 인덱스 선택
      //   selectedDirection.push(rotateDirections[randomDirectionIndex]); // 랜덤한 방향을 리스트에 추가
      // }

      console.log('------- selectedDirection: ', selectedDirection);

      // 10초 타이머 설정
      setTimeout(handleTimeout, timeoutDuration);
    }

    // 2. N초 동안 얼굴을 해당 방향으로 돌렸는지 확인한다.

    if (!isTimeOut) {
      // 머리가 일정 범위 내에서 움직이는지 확인
      if (
        nose.x > leftShoulder.x - rangeShoulderX &&
        nose.x < rightShoulder.x + rangeShoulderX &&
        nose.y > leftShoulder.y - rangeShoulderY &&
        nose.y < leftShoulder.y + rangeShoulderY
      ) {
        currentStatus = '고개를 정면으로 향했습니다.';
      } else {
        // 머리가 상하로 돌아갔는지 확인
        if (centerSholderY - centerMouthY < (centerMouthY - nose.y) * 3) {
          currentStatus = '고개를 상으로 돌렸습니다.';
        } else if (nose.y > leftShoulder.y) {
          currentStatus = '고개를 하로 돌렸습니다.';
        }

        // 머리가 좌우로 돌아갔는지 확인
        // 조건 수정 필요!!!!!!! --------
        if (nose.x < (leftShoulder.x + rightShoulder.x) / 2.4) {
          currentStatus = '좌';
          console.log('------------ ', currentStatus);
        } else if (nose.x > (leftShoulder.x + rightShoulder.x) / 1.8) {
          currentStatus = '우';
          console.log('------------ ', currentStatus);
          // 상, 하 조건도 추가해야 함
        } else {
          currentStatus = '정면';
        }

        // 3. 같은 방향으로 돌렸다면 점수를 준다.
        if (currentStatus === selectedDirection[0]) {
          // 현재 상태가 다음 방향과 일치하는지 확인
          selectedDirection.shift(); // 다음 방향으로 이동

          currentSuccessCount += 1;
          console.log('------------ CURRENT SCORE: ', currentSuccessCount);
        }
      }
    }

    // 4. 1~3을 3번 반복해서 점수가 일정 이상 쌓였다면 성공으로 판별한다.
    if (!myMissionStatus && isTimeOut && !isEstimated) {
      if (currentSuccessCount >= numberDirections) {
        // 방향을 모두 수행했을 경우
        myMissionStatus = true; // 성공
        console.log('------------ FINAL RESULT: 성공!!!!!!!');
        console.log('---------- Final Score:', currentSuccessCount);
      } else {
        myMissionStatus = false; // 성공
        console.log('------------ FINAL RESULT: 실패.......');
        console.log('---------- Final Score:', currentSuccessCount);
      }

      // 한 번만 출력 결과를 출력하도록
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

  NeckGame(results.poseLandmarks);

  canvasCtx.restore();

  return myMissionStatus;
};
