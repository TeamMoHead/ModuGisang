import './Mission0.css';
import * as pose from '@mediapipe/pose';
import smoothLandmarks from 'mediapipe-pose-smooth'; // ES6
import * as cam from '@mediapipe/camera_utils';
import * as drawingUtils from '@mediapipe/drawing_utils';
import { useRef, useEffect, useState, useCallback } from 'react';

const landmarksToColors = {
  [pose.POSE_LANDMARKS.NOSE]: 'rgb(255,255,255)',
  [pose.POSE_LANDMARKS.LEFT_SHOULDER]: 'rgb(55,138,0)',
  [pose.POSE_LANDMARKS.RIGHT_SHOULDER]: 'rgb(255,138,137)',
  [pose.POSE_LANDMARKS.LEFT_ELBOW]: 'rgb(255,38,99)',
  [pose.POSE_LANDMARKS.RIGHT_ELBOW]: 'rgb(5,138,144)',
  [pose.POSE_LANDMARKS.LEFT_WRIST]: 'rgb(205,18,217)',
  [pose.POSE_LANDMARKS.RIGHT_WRIST]: 'rgb(255,198,169)',
  [pose.POSE_LANDMARKS.LEFT_HIP]: 'rgb(45,138,109)',
  [pose.POSE_LANDMARKS.RIGHT_HIP]: 'rgb(175,108,169)',
};

function Mission0() {
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
      const leftWrist = poseLandmarks[pose.POSE_LANDMARKS.LEFT_WRIST];
      const rightShoulder = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_SHOULDER];
      const rightWrist = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_WRIST];

      let newScore = 0; // 새로운 점수 변수 초기화

      // 왼쪽 팔을 올렸을 때
      if (leftWrist.y < leftShoulder.y && rightWrist.y >= rightShoulder.y) {
        setStatusMessage('왼쪽 팔을 올렸습니다. 점수 +1');
        newScore = 1; // 왼쪽 팔을 올렸을 때는 1점 증가
      }
      // 오른쪽 팔을 올렸을 때
      else if (
        rightWrist.y < rightShoulder.y &&
        leftWrist.y >= leftShoulder.y
      ) {
        setStatusMessage('오른쪽 팔을 올렸습니다. 점수 +2');
        newScore = 2; // 오른쪽 팔을 올렸을 때는 2점 증가
      }
      // 양 손을 머리 위로 올렸을 때
      else if (leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y) {
        setStatusMessage('양 손을 머리 위로 올렸습니다. 점수 +5');
        newScore = 5; // 양 손을 머리 위로 올렸을 때는 5점 증가
      }
      // 팔의 상태가 변하지 않았을 때
      else {
        setStatusMessage('팔의 상태가 변하지 않았습니다.');
      }

      // 현재 점수와 새로운 점수를 비교하여 더 큰 값을 새로운 점수로 설정
      setScore(prevScore => Math.max(prevScore, newScore));
    },
    [setStatusMessage, setScore],
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
      <div className="container">
        <video className="input_video" ref={webcamRef} /> Rendering the webcam
        video element <br />
        현재 입력 값: <p>{status}</p>
        <p>점수: {score}</p> {/* 점수 표시 */}
        <canvas ref={canvasRef} className="output_canvas"></canvas>
      </div>
    </div>
  );
}

export default Mission0;
