import './Mission2.css';
import * as pose from '@mediapipe/pose';
import smoothLandmarks from 'mediapipe-pose-smooth'; // ES6
import * as cam from '@mediapipe/camera_utils';
import * as drawingUtils from '@mediapipe/drawing_utils';
import { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

const ContentText = styled.p`
  font-size: 50px;
  white-space: pre-wrap;
`;

const landmarksToColors = {
  [pose.POSE_LANDMARKS.NOSE]: 'rgb(255,255,255)',
  [pose.POSE_LANDMARKS.LEFT_EAR]: 'rgb(205,18,217)',
  [pose.POSE_LANDMARKS.RIGHT_EAR]: 'rgb(255,198,169)',
  [pose.POSE_LANDMARKS.MOUTH_LEFT]: 'rgb(45,138,109)',
  [pose.POSE_LANDMARKS.MOUTH_RIGHT]: 'rgb(175,108,169)',
  [pose.POSE_LANDMARKS.LEFT_SHOULDER]: 'rgb(55,138,0)',
  [pose.POSE_LANDMARKS.RIGHT_SHOULDER]: 'rgb(255,138,137)',
  // [pose.POSE_LANDMARKS.LEFT_ELBOW]: 'rgb(255,38,99)',
  // [pose.POSE_LANDMARKS.RIGHT_ELBOW]: 'rgb(5,138,144)',
};

function Mission2() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [didLoad, setDidLoad] = useState(false);
  const [status, setStatus] = useState('None');
  const [score, setScore] = useState(0); // 점수 상태 변수

  const setStatusMessage = useCallback(message => {
    setStatus(message);
  }, []);

  const stretchingGame = useCallback(
    poseLandmarks => {
      const leftShoulder = poseLandmarks[pose.POSE_LANDMARKS.LEFT_SHOULDER];
      const rightShoulder = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_SHOULDER];
      const nose = poseLandmarks[pose.POSE_LANDMARKS.NOSE];

      let newStatus = 'None'; // 새로운 상태 변수 초기화

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
        newStatus = '고개를 정면으로 향했습니다.';
      } else {
        // 머리가 상하로 돌아갔는지 확인
        if (nose.y < leftShoulder.y) {
          newStatus = '고개를 상으로 돌렸습니다.';
        } else if (nose.y > leftShoulder.y) {
          newStatus = '고개를 하로 돌렸습니다.';
        }

        // 머리가 좌우로 돌아갔는지 확인
        if (nose.x < (leftShoulder.x + rightShoulder.x) / 2.4) {
          newStatus = '좌';
        } else if (nose.x > (leftShoulder.x + rightShoulder.x) / 1.8) {
          newStatus = '우';
        } else {
          newStatus = '정면';
        }
      }

      setStatusMessage(newStatus);
    },
    [setStatusMessage],
  );

  useEffect(() => {
    let camera; // camera 변수 추가

    if (!didLoad) {
      const mpPose = new pose.Pose({
        locateFile: file => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
      });
      mpPose.setOptions({
        upperBodyOnly: true,
        selfieMode: true,
        modelComplexity: 0,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      camera = new cam.Camera(webcamRef.current, {
        onFrame: async () => {
          const canvasElement = canvasRef.current;
          const aspect = window.innerHeight / window.innerWidth;
          let width, height;
          if (window.innerWidth > window.innerHeight) {
            height = window.innerHeight;
            width = height / aspect;
          } else {
            width = window.innerWidth;
            height = width * aspect;
          }
          canvasElement.width = width;
          canvasElement.height = height;
          await mpPose.send({ image: webcamRef.current });
        },
      });
      camera.start();
      mpPose.onResults(results =>
        smoothLandmarks(results, poseLandmarks => {
          const canvasElement = canvasRef.current;
          const canvasCtx = canvasElement.getContext('2d');
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          canvasCtx.drawImage(
            results.image,
            0,
            0,
            canvasElement.width,
            canvasElement.height,
          );
          if (results.poseLandmarks) {
            drawingUtils.drawConnectors(
              canvasCtx,
              results.poseLandmarks,
              pose.POSE_CONNECTIONS,
              { visibilityMin: 0.65, color: 'white' },
            );
            Object.entries(landmarksToColors).forEach(([landmark, color]) => {
              drawingUtils.drawLandmarks(
                canvasCtx,
                [results.poseLandmarks[landmark]],
                { visibilityMin: 0.65, color: 'black', fillColor: color },
              );
            });
            stretchingGame(results.poseLandmarks);
          }
          canvasCtx.restore();
        }),
      );
      setDidLoad(true);
    }

    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, [didLoad, stretchingGame]);

  return (
    <div className="App">
      <div style={{ position: 'relative', width: 1200, height: 800 }}>
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            color: 'white',
            zIndex: 10,
          }}
        >
          Score: {score}
        </div>
        <video
          className="input_video"
          ref={webcamRef}
          style={{ width: '100%', height: 'auto' }}
        />
        <ContentText>
          <p>{status}</p>
          <p>점수: {score}</p> {/* 점수 표시 */}
        </ContentText>
        <canvas ref={canvasRef} className="output_canvas"></canvas>
      </div>
    </div>
  );
}

export default Mission2;
