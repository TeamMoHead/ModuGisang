// import * as face from '@mediapipe/face_mesh';
// import { drawConnectors } from '@mediapipe/drawing_utils';
import stickyNoteImage from '../../../assets/sticky_note.png';

let topScore = 0;
let leftScore = 0;
let rightScore = 0;
let targetNumber = 5;
let prevTopEyebrowPosition = null;
let prevLeftCheekPosition = null;
let prevRightCheekPosition = null;
let prevJawPosition = null;
let isMovingScore = 0;
let isMovingStatus = true; // 움직이는 중인지 여부
let myMissionStatus = [false, false, false]; // 측정 결과

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
    if (!faceLandmarks) return;

    const jawIndex = 152;
    const jaw = results.faceLandmarks[jawIndex];
    if (prevJawPosition) {
      const deltaJawX = Math.abs(jaw.x - prevJawPosition.x);
      const deltaJawY = Math.abs(jaw.y - prevJawPosition.y);

      const underLipIndex = 199; // 좌측 볼 인덱스
      const underLip = results.faceLandmarks[underLipIndex];
      const heightJaw = Math.abs(jaw.y - underLip.y);

      if (deltaJawX > heightJaw || deltaJawY > heightJaw) {
        isMovingScore = 0;
        isMovingStatus = true;
        // console.log('----- 움직이는 중');
      } else {
        isMovingScore += 1;

        if (isMovingScore > 50) {
          // console.log('----- 움직임이 멈춤');
          isMovingStatus = false;
        }
      }
      const topEyebrowIndex = 107; // 눈썹 인덱스
      const topEyebrow = results.faceLandmarks[topEyebrowIndex];

      const leftCheekIndex = 61; // 우측 볼 인덱스
      const leftCheek = results.faceLandmarks[leftCheekIndex];

      const rightCheekIndex = 291; // 우측 볼 인덱스
      const rightCheek = results.faceLandmarks[rightCheekIndex];

      if (!isMovingStatus) {
        // 윗 입술의 높이
        const heightLip =
          Math.abs(results.faceLandmarks[0].y - results.faceLandmarks[12].y) *
          0.45;

        // 눈썹 높이
        if (topEyebrow && topScore < targetNumber) {
          // 이전 볼의 좌표랑 비교해서 움직임을 확인
          if (prevTopEyebrowPosition) {
            // const deltaTopX = topEyebrow.x - prevTopEyebrowPosition.x;
            const deltaTopY = topEyebrow.y - prevTopEyebrowPosition.y;

            // // 눈썹 높이
            // const heightEyebrow =
            //   Math.abs(topEyebrow.y - results.faceLandmarks[65].y) * 0.5;
            // console.log('deltaTopY:', topEyebrow.y - prevTopEyebrowPosition.y);
            if (Math.abs(deltaTopY) > heightLip * 1.8) {
              topScore = topScore + 1;
              // console.log('----topScore:  ', topScore);

              if (topScore >= targetNumber) {
                myMissionStatus[0] = true;
                // drawImageOnFace(canvasCtx, results.faceLandmarks, 107, image);
              }
            }
          }
        }

        // 좌측 볼 움직임 확인
        if (leftCheek && leftScore < targetNumber) {
          // 이전 볼의 좌표랑 비교해서 움직임을 확인
          if (prevLeftCheekPosition) {
            const deltaLeftX = leftCheek.x - prevLeftCheekPosition.x;
            const deltaLeftY = leftCheek.y - prevLeftCheekPosition.y;
            // console.log('deltaLeftY:', leftCheek.y - prevLeftCheekPosition.y);
            if (
              Math.abs(deltaLeftY) > heightLip &&
              Math.abs(deltaLeftX) > heightLip
            ) {
              leftScore = leftScore + 1;
              // console.log('----leftScore:  ', leftScore);

              if (leftScore >= targetNumber) {
                myMissionStatus[1] = true;
                // drawImageOnFace(canvasCtx, results.faceLandmarks, 205, image);
              }
            }
          }
        }

        // 우측 볼 움직임 확인
        // console.log('----right cheek:  ', rightCheek);
        if (rightCheek && rightScore < targetNumber) {
          // 이전 볼의 좌표랑 비교해서 움직임을 확인
          if (prevRightCheekPosition) {
            const deltaRightX = rightCheek.x - prevRightCheekPosition.x;
            const deltaRightY = rightCheek.y - prevRightCheekPosition.y;
            // console.log('----deltaRightY:', deltaRightY);
            if (
              Math.abs(deltaRightX) > heightLip &&
              Math.abs(deltaRightY) > heightLip
            ) {
              rightScore = rightScore + 1;
              // console.log('----rightScore:  ', rightScore);

              if (rightScore >= targetNumber) {
                myMissionStatus[2] = true;
                // drawImageOnFace(canvasCtx, results.faceLandmarks, 425, image);
              }
            }
          }
        }
      }
      // 이전 눈썹 위치 갱신
      prevTopEyebrowPosition = { x: topEyebrow.x, y: topEyebrow.y };
      // 이전 좌측 볼의 좌표 갱신
      prevLeftCheekPosition = { x: leftCheek.x, y: leftCheek.y };
      // 이전 우측 볼의 좌표 갱신
      prevRightCheekPosition = { x: rightCheek.x, y: rightCheek.y };
    }
    prevJawPosition = { x: jaw.x, y: jaw.y };

    // 얼굴 랜드마크에 그림을 붙이는 함수 호출
    // drawImageOnFace(canvasCtx, results.faceLandmarks, 107, image);
  };

  // const drawImageOnFace = (canvasCtx, landmarks, index, image) => {
  //   // 인덱스에 해당하는 얼굴 랜드마크 좌표 가져오기
  //   const point = landmarks[index];

  //   if (point) {
  //     // 캔버스의 크기 가져오기
  //     const canvasWidth = canvasCtx.canvas.width;
  //     const canvasHeight = canvasCtx.canvas.height;

  //     // console.log('==== NEW Size :', canvasWidth, canvasHeight);
  //     // 얼굴 크기 계산
  //     const faceWidth =
  //       Math.abs(landmarks[123].x - landmarks[352].x) * canvasWidth; // 왼쪽 끝점과 오른쪽 끝점의 x 좌표 차이를 얼굴 너비로 사용

  //     // console.log('==== NEW faceWidth :', faceWidth);
  //     // 이미지 크기 조절
  //     const resizedSize = faceWidth * 0.33; // 얼굴 너비의 절반 크기로 조절
  //     const resizedImage = resizeImage(image, resizedSize);

  //     // console.log('==== NEW resizedSize :', resizedSize);

  //     // 얼굴 랜드마크의 x, y 좌표
  //     let { x, y } = point;

  //     // console.log('==== NEW x, Y :', x, y);

  //     // 얼굴 랜드마크의 비율을 캔버스의 픽셀 값으로 변환
  //     x *= canvasWidth;
  //     y *= canvasHeight;

  //     // 그림의 중앙 좌표 계산 (그림이 얼굴의 중앙에 위치하도록)
  //     const drawX = x - resizedImage.width / 2;
  //     const drawY = y - resizedImage.height / 2;

  //     // console.log('==== NEW drawX, Y :', drawX, drawY);

  //     // 그림 그리기
  //     canvasCtx.drawImage(resizedImage, drawX, drawY);
  //   }
  // };

  // // 이미지 크기 조절 함수
  // const resizeImage = (image, size) => {
  //   const canvas = document.createElement('canvas');
  //   canvas.width = size;
  //   canvas.height = size;
  //   const ctx = canvas.getContext('2d');
  //   ctx.drawImage(image, 0, 0, size, size);
  //   return canvas;
  // };

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

  if (myMissionStatus.some(status => !status)) {
    postitGame(results.faceLandmarks);
  }

  canvasCtx.restore();

  return myMissionStatus;
};
