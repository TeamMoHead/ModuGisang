import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import createPerformanceMonitor from './Performance';

const WorkerTest = () => {
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [inferenceTime, setInferenceTime] = useState(null);
  const videoElement = useRef(null);
  const canvasElement = useRef(null);
  const workerRef = useRef(null);

  const performanceMonitor = useRef(createPerformanceMonitor());
  const [performanceResult, setPerformanceResult] = useState(null);

  useEffect(() => {
    const worker = new Worker(new URL('./worker.js', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;

    worker.onmessage = event => {
      if (event.data.type === 'ready') {
        worker.postMessage({ type: 'initialize' });
      } else if (event.data.type === 'initialized') {
        setIsModelInitialized(true);
      } else if (event.data.type === 'results') {
        drawResults(event.data.results);
        setInferenceTime(event.data.inferenceTime);
        performanceMonitor.current.collectData(event.data.inferenceTime);
      } else if (event.data.type === 'stopped') {
        const result = performanceMonitor.current.analyzePerformance();
        setPerformanceResult(result);
        console.log('==========Performance Analysis=========');
        console.log(result);
        performanceMonitor.current.reset();
      }
    };

    worker.onerror = error => {
      console.error('Worker error:', error);
    };

    return () => {
      console.log('Terminating worker');
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    console.log(
      '<Main Thread> Effect triggered, isModelInitialized:',
      isModelInitialized,
    );

    if (isModelInitialized && videoElement.current) {
      console.log('<Main Thread> Setting up video');
      videoElement.current.src =
        process.env.PUBLIC_URL + '/sample_stretching.mp4';

      videoElement.current.onloadeddata = () => {
        console.log('<Main Thread> Video loaded, trying to play');
        videoElement.current
          .play()
          .then(() => {
            console.log(
              '<Main Thread> Video playing, requesting animation frame',
            );
            requestAnimationFrame(detectPose);
          })
          .catch(error => {
            console.error('<Main Thread> Error playing video:', error);
          });
      };

      videoElement.current.onended = () => {
        console.log('<Main Thread> Video ended');
        // 비디오가 끝났을 때 worker에게 정지 메시지 전송
        workerRef.current.postMessage({ type: 'stop' });
      };
    }
  }, [isModelInitialized]);

  const detectPose = async () => {
    if (videoElement.current.paused || videoElement.current.ended) {
      return;
    }

    const startTime = performance.now();
    createImageBitmap(videoElement.current).then(imageBitmap => {
      workerRef.current.postMessage({ type: 'detect', image: imageBitmap }, [
        imageBitmap,
      ]);
    });

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

    if (results.poseLandmarks) {
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 4,
      });
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 2,
      });
    }
    canvasCtx.restore();
  };

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

export default WorkerTest;

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
