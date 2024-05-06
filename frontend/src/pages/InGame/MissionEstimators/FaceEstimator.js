import * as face from '@mediapipe/face_mesh';
import { drawConnectors } from '@mediapipe/drawing_utils';
import stickyNoteImage from '../../../assets/sticky_note.png';

let leftScore = 0;
let rightScore = 0;
let prevLeftCheekPosition = null;
let prevRightCheekPosition = null;

export const estimateFace = ({ results, myVideoRef, canvasRef }) => {
  if (
    !myVideoRef.current ||
    !canvasRef.current ||
    !results?.faceLandmarks?.length > 0
  )
    return;

  const canvasElement = canvasRef.current;
  const canvasCtx = canvasElement.getContext('2d');
  if (canvasCtx == null) throw new Error('Could not get context');
  canvasElement.width = myVideoRef.current.videoWidth;
  canvasElement.height = myVideoRef.current.videoHeight;

  // 이미지 객체 생성
  const image = new Image();
  image.src = stickyNoteImage;

  const postitGame = faceLandmarks => {
    let targetNumber = 100;

    // Check left cheek movement
    const leftCheekIndex = 61; // Left cheek landmark index
    const leftCheek = results.faceLandmarks[leftCheekIndex];
    if (leftCheek && leftScore < targetNumber) {
      if (prevLeftCheekPosition) {
        const deltaLeftY = leftCheek.y - prevLeftCheekPosition.y;
        // console.log('deltaLeftY:', leftCheek.y - prevLeftCheekPosition.y);
        if (Math.abs(deltaLeftY) > 0.01) {
          // Threshold for detecting movement, adjust as needed
          leftScore = leftScore + 1;
          console.log('----leftScore:  ', leftScore);
        }
      }
      prevLeftCheekPosition = { x: leftCheek.x, y: leftCheek.y };
      // console.log('prevLeftCheekPosition:', { x: leftCheek.x, y: leftCheek.y });
    }

    const A = faceLandmarks[face.FACEMESH_RIGHT_IRIS];

    // Check right cheek movement
    const rightCheekIndex = 291; // Right cheek landmark index
    const rightCheek = results.faceLandmarks[rightCheekIndex];
    // console.log('----right cheek:  ', rightCheek);
    if (rightCheek && rightScore < targetNumber) {
      // Set previous right cheek position
      if (prevRightCheekPosition) {
        const deltaRightY = rightCheek.y - prevRightCheekPosition.y;
        // console.log('----deltaRightY:', deltaRightY);
        if (Math.abs(deltaRightY) > 0.01) {
          // Threshold for detecting movement, adjust as needed
          rightScore = rightScore + 1;
          console.log('----rightScore:  ', rightScore);
        }
      } else {
        console.log('----계산 안 되었음!!!!!!!');
      }
      prevRightCheekPosition = { x: rightCheek.x, y: rightCheek.y };
      // console.log('prevRightCheekPosition:', prevRightCheekPosition);

      // 얼굴 랜드마크에 그림을 붙이는 함수 호출
      if (leftScore < targetNumber) {
        drawImageOnFace(canvasCtx, results.faceLandmarks, 205, image);
      }
      if (rightScore < targetNumber) {
        drawImageOnFace(canvasCtx, results.faceLandmarks, 425, image);
      }
    }
  };

  const drawImageOnFace = (canvasCtx, landmarks, index, image) => {
    // 인덱스에 해당하는 얼굴 랜드마크 좌표 가져오기
    const point = landmarks[index];
    if (point) {
      // 캔버스의 크기 가져오기
      const canvasWidth = canvasCtx.canvas.width;
      const canvasHeight = canvasCtx.canvas.height;

      // 이미지 크기 조절
      const resizedWidth = 40; // 원하는 너비로 조절
      const resizedHeight = 40; // 원하는 높이로 조절
      const resizedImage = resizeImage(image, resizedWidth, resizedHeight);

      // 얼굴 랜드마크의 x, y 좌표
      let { x, y } = point;

      // console.log('x: ', x);
      // console.log('y: ', y);

      // 얼굴 랜드마크의 비율을 캔버스의 픽셀 값으로 변환
      x *= canvasWidth;
      y *= canvasHeight;

      // 그림의 중앙 좌표 계산 (그림이 얼굴의 중앙에 위치하도록)
      const imageCenterX = x - resizedImage.width / 2;
      const imageCenterY = y - resizedImage.height / 2;

      // console.log('imageCenterX: ', imageCenterX);
      // console.log('imageCenterY: ', imageCenterY);

      // 그림을 그릴 좌표 설정
      const drawX = imageCenterX < 0 ? 0 : imageCenterX; // 캔버스 좌측 범위를 벗어나지 않도록 설정
      const drawY = imageCenterY < 0 ? 0 : imageCenterY; // 캔버스 상단 범위를 벗어나지 않도록 설정

      // 그림 그리기
      canvasCtx.drawImage(resizedImage, drawX, drawY);
    }
  };

  // 이미지 크기 조절 함수
  const resizeImage = (image, width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);
    return canvas;
  };

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // 용도를 정확하게 알지 못 해 주석 처리
  // Only overwrite existing pixels.
  // canvasCtx.globalCompositeOperation = 'source-in';
  // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  // Only overwrite missing pixels.
  // canvasCtx.globalCompositeOperation = 'destination-atop';

  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height,
  );

  // canvasCtx.globalCompositeOperation = 'source-over';

  drawConnectors(canvasCtx, results.faceLandmarks, face.FACEMESH_TESSELATION, {
    color: '#C0C0C070',
    lineWidth: 1,
  });

  // setInterval을 사용하여 일정 시간 간격으로 estimateFace 함수 호출
  const intervalId = setInterval(() => {
    // estimateFace 함수 호출
    postitGame(results.faceLandmarks);
  }, 1000); // 1초마다 호출하도록 설정 (1000ms = 1초)

  // clearInterval을 사용하여 interval 정지
  // 일정 시간이 지나면 주기적으로 호출되는 estimateFace 함수를 멈출 수 있습니다.
  // clearInterval(intervalId); // intervalId는 setInterval 함수의 반환값으로, 정지하려는 interval의 식별자입니다.

  postitGame(results.faceLandmarks);

  canvasCtx.restore();
};
