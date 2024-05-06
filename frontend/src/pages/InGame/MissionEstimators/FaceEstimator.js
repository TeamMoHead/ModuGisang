import * as face from '@mediapipe/face_mesh';
// import vision from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3';
// import { drawConnectors } from '@mediapipe/drawing_utils';
import stickyNoteImage from '../../../assets/sticky_note.png';

let leftScore = 0;
let rightScore = 0;
let targetNumber = 10;
let myMissionStatus = false; // 측정 결과
let prevLeftCheekPosition = null;
let prevRightCheekPosition = null;

// TASK VISION 테스트용 코드
// const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

export const estimateFace = ({ results, myVideoRef, canvasRef }) => {
  if (!myVideoRef.current || !canvasRef.current) return;

  const canvasElement = canvasRef.current;
  const canvasCtx = canvasElement.getContext('2d');
  if (canvasCtx == null) throw new Error('Could not get context');
  canvasElement.width = myVideoRef.current.videoWidth;
  canvasElement.height = myVideoRef.current.videoHeight;

  // 이미지 객체 생성
  const image = new Image();
  image.src = stickyNoteImage;

  // ------------ TASK VISION 테스트용 코드 시작
  // --------------------------------------

  // console.log('----------- 0:', results.faceBlendshapes[0]);

  // const blendShapesData = results.blendShapes;
  // console.log('---------- blendShapesData: ', blendShapesData.categories[33]);

  // results.blendShapes가 유효한지 확인
  // if (results.blendShapes && results.blendShapes.length > 0) {
  //   const blendShapesData = results.blendShapes;
  // blendShapesData 배열이 존재하고 비어있지 않은 경우에만 접근
  //   if (
  //     blendShapesData[0].categories &&
  //     blendShapesData[0].categories.length > 9
  //   ) {
  //     const category9 = blendShapesData[0].categories[33];
  //     console.log(category9);
  //     // category9 또는 해당하는 데이터를 사용하는 코드 작성
  //   } else {
  //     console.log('Blend shapes data does not contain category 33.');
  //   }
  // } else {
  //   console.log('No blend shapes data available.');
  // }

  // ------------ TASK VISION 테스트용 코드 끝
  // --------------------------------------

  const postitGame = faceLandmarks => {
    if (!faceLandmarks) return;

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

      if (
        !myMissionStatus &&
        leftScore >= targetNumber &&
        rightScore >= targetNumber
      ) {
        myMissionStatus = true;
        console.log('---------- Final RESULT: ', myMissionStatus);
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

      // 얼굴 크기 계산
      const faceWidth =
        Math.abs(landmarks[123].x - landmarks[352].x) * canvasWidth; // 왼쪽 끝점과 오른쪽 끝점의 x 좌표 차이를 얼굴 너비로 사용

      // 이미지 크기 조절
      const resizedWidth = faceWidth * 0.33; // 얼굴 너비의 절반 크기로 조절
      const resizedHeight = faceWidth * 0.33; // 얼굴 높이의 절반 크기로 조절
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

  // drawConnectors(canvasCtx, results.faceLandmarks, face.FACEMESH_TESSELATION, {
  //   color: '#C0C0C070',
  //   lineWidth: 1,
  // });

  postitGame(results.faceLandmarks);

  canvasCtx.restore();

  return myMissionStatus;
};
