import React, { useState, useEffect, useRef } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import styled from 'styled-components';

const Practice = () => {
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [inferenceTime, setInferenceTime] = useState(null);
  const videoElement = useRef(null);
  const logElement = useRef(null);
  const workerRef = useRef(null);

  useEffect(() => {
    const worker = new Worker(new URL('./worker.js', import.meta.url));
    workerRef.current = worker;

    worker.onmessage = event => {
      if (event.data.type === 'initialized') {
        setIsModelInitialized(true);
        console.log('======PoseModel initialized');
      } else if (event.data.type === 'results') {
        console.log('Results: ', event.data.results);
      }
    };

    worker.postMessage({
      type: 'initialize',
      modelPath:
        'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose_landmark_full.tflite',
    });

    return () => {
      // worker.terminate();
    };
  }, []);

  useEffect(() => {
    if (isModelInitialized) {
      const camera = new Camera(videoElement.current, {
        onFrame: async () => {
          const start = performance.now();
          const imageBitmap = await createImageBitmap(videoElement.current);
          workerRef.current.postMessage(
            { type: 'inference', image: imageBitmap },
            [imageBitmap],
          );
          const end = performance.now();
          setInferenceTime(end - start);
        },
        width: 640,
        height: 480,
      });

      camera.start();
    }
  }, [isModelInitialized]);

  return (
    <Wrapper>
      practice
      <Video ref={videoElement} />
      <div ref={logElement}>
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

const Video = styled.video`
  width: 100%;
  height: 100%;
  border: 1px solid yellow;
`;
