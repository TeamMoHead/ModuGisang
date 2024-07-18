import React, { useState, useEffect, useRef } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import styled from 'styled-components';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const Practice = () => {
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [inferenceTime, setInferenceTime] = useState(null);
  const videoElement = useRef(null);
  const canvasElement = useRef(null);
  const poseLandmarkerRef = useRef(null);

  useEffect(() => {
    const initializePoseLandmarker = async () => {
      console.log('Initializing PoseLandmarker');
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
        );
        poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numPoses: 2,
          },
        );
        console.log('PoseLandmarker initialized');
        setIsModelInitialized(true);
      } catch (error) {
        console.error('Error initializing PoseLandmarker:', error);
      }
    };

    initializePoseLandmarker();
  }, []);

  useEffect(() => {
    if (isModelInitialized && videoElement.current) {
      const camera = new Camera(videoElement.current, {
        onFrame: async () => {
          await detectPose();
        },
        width: 480,
        height: 640,
      });

      camera.start();
    }
  }, [isModelInitialized]);

  const detectPose = async () => {
    if (
      !poseLandmarkerRef.current ||
      !videoElement.current ||
      !canvasElement.current
    )
      return;

    const startTimeMs = performance.now();
    const results = poseLandmarkerRef.current.detectForVideo(
      videoElement.current,
      performance.now(),
    );
    const inferenceTimeMs = performance.now() - startTimeMs;

    setInferenceTime(inferenceTimeMs);
    drawResults(results);
  };

  const drawResults = results => {
    const canvasCtx = canvasElement.current.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(
      0,
      0,
      canvasElement.current.width,
      canvasElement.current.height,
    );
    canvasCtx.drawImage(
      videoElement.current,
      0,
      0,
      canvasElement.current.width,
      canvasElement.current.height,
    );

    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawConnectors(canvasCtx, landmarks, POSE_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 4,
        });
        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
      }
    }
    canvasCtx.restore();
  };

  return (
    <Wrapper>
      practice
      <VideoCanvas>
        <Video ref={videoElement} />
        <Canvas ref={canvasElement} width="480" height="640" />
      </VideoCanvas>
      <div>
        {inferenceTime && <p>Inference Time: {inferenceTime.toFixed(2)} ms</p>}
      </div>
    </Wrapper>
  );
};

export default Practice;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 104px 24px 30px 24px;
  border: 1px solid white;
`;

const VideoCanvas = styled.div`
  position: relative;
  width: 480px;
  height: 640px;
`;

const Video = styled.video`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Canvas = styled.canvas`
  position: absolute;
  width: 100%;
  height: 100%;
`;
