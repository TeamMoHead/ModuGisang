import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import createPerformanceMonitor from './Performance';

const Practice = () => {
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [inferenceTime, setInferenceTime] = useState(null);
  const videoElement = useRef(null);
  const canvasElement = useRef(null);
  const poseLandmarkerRef = useRef(null);

  const performanceMonitor = useRef(createPerformanceMonitor());
  const [performanceResult, setPerformanceResult] = useState(null);

  useEffect(() => {
    const initializePoseLandmarker = async () => {
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
          numPoses: 1,
        },
      );
      setIsModelInitialized(true);
      console.log('======PoseLandmarker initialized');
    };

    initializePoseLandmarker();
  }, []);

  useEffect(() => {
    console.log('Effect triggered, isModelInitialized:', isModelInitialized);
    if (isModelInitialized && videoElement.current) {
      console.log('Setting up video');
      videoElement.current.src =
        process.env.PUBLIC_URL + '/sample_stretching.mp4';

      videoElement.current.onloadeddata = () => {
        console.log('Video loaded, trying to play');
        videoElement.current
          .play()
          .then(() => {
            console.log('Video playing, requesting animation frame');
            requestAnimationFrame(detectPose);
          })
          .catch(error => {
            console.error('Error playing video:', error);
          });
      };

      videoElement.current.onended = () => {
        console.log('Video ended');
        const result = performanceMonitor.current.analyzePerformance();
        setPerformanceResult(result);
        console.log('==========Performance Analysis=========');
        console.log(result);
        performanceMonitor.current.reset();
      };
    }
  }, [isModelInitialized]);

  const detectPose = async () => {
    if (videoElement.current.paused || videoElement.current.ended) {
      return;
    }

    const startTime = performance.now();
    const results = poseLandmarkerRef.current.detectForVideo(
      videoElement.current,
      performance.now(),
    );
    const inferenceTime = performance.now() - startTime;

    setInferenceTime(inferenceTime);
    performanceMonitor.current.collectData(inferenceTime);

    drawResults(results);

    requestAnimationFrame(detectPose);
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

  // const handleWorkerMessage = async event => {
  //   if (event.data.type === 'results') {
  //     const inferenceTime = event.data.inferenceTime;
  //     // ...
  //     const performanceData =
  //       await performanceMonitor.current.collectData(inferenceTime);
  //     if (performanceData) {
  //       console.log('==========Performance Analysis=========');
  //       console.log(performanceData);
  //       performanceMonitor.current.reset();
  //     }
  //   }
  // };

  return (
    <Wrapper>
      practice
      <VideoCanvas>
        <Video ref={videoElement} playsInline muted />

        <Canvas ref={canvasElement} width="360" height="640" />
      </VideoCanvas>
      <div>
        {inferenceTime && <p>Inference Time: {inferenceTime.toFixed(2)} ms</p>}
      </div>
      {performanceResult && (
        <div>
          <h3>Performance Analysis:</h3>
          <p>
            Average Inference Time:{' '}
            {performanceResult.avgInferenceTime.toFixed(2)} ms
          </p>
          <p>
            Max Inference Time: {performanceResult.maxInferenceTime.toFixed(2)}{' '}
            ms
          </p>
          <p>
            Min Inference Time: {performanceResult.minInferenceTime.toFixed(2)}{' '}
            ms
          </p>
          <p>FPS: {performanceResult.fps.toFixed(2)}</p>
          <p>Total Frames: {performanceResult.totalFrames}</p>
          <p>Total Time: {(performanceResult.totalTime / 1000).toFixed(2)} s</p>
        </div>
      )}
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
  width: 360px;
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
