import React, { useState, useEffect, useRef } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import styled from 'styled-components';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';

const Practice = () => {
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [inferenceTime, setInferenceTime] = useState(null);
  const videoElement = useRef(null);
  const canvasElement = useRef(null);
  const workerRef = useRef(null);

  useEffect(() => {
    console.log('Creating worker');
    const worker = new Worker(new URL('./worker.js', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;

    worker.onmessage = event => {
      console.log('Message from worker:', event.data);
      if (event.data.type === 'ready') {
        console.log('Worker is ready, sending initialize message');
        worker.postMessage({ type: 'initialize' });
      } else if (event.data.type === 'initialized') {
        setIsModelInitialized(true);
        console.log('======PoseLandmarker initialized');
      } else if (event.data.type === 'results') {
        console.log('Results: ', event.data.results);
        drawResults(event.data.results);
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
    if (isModelInitialized && videoElement.current) {
      const camera = new Camera(videoElement.current, {
        onFrame: async () => {
          if (!workerRef.current) return;

          const start = performance.now();
          const imageBitmap = await createImageBitmap(videoElement.current);
          workerRef.current.postMessage(
            { type: 'detect', image: imageBitmap },
            [imageBitmap],
          );
          const end = performance.now();
          setInferenceTime(end - start);
        },
        width: 480,
        height: 640,
      });

      camera.start();
    }
  }, [isModelInitialized]);

  const drawResults = results => {
    if (!canvasElement.current) return;

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
