import React, { useRef, useEffect, useContext, useState } from 'react';
import { GameContext, OpenViduContext } from '../../../contexts';
import { estimatePose } from '../MissionEstimators/PoseEstimator';
import styled from 'styled-components';

const Mission1 = () => {
  const { inGameMode, setIsGameLoading, setMyMissionStatus } =
    useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);
  const [worker, setWorker] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const poseWorker = new Worker(
      `${process.env.REACT_APP_CLIENT_URL}/workers/poseWorker.js`,
    );

    setWorker(poseWorker);

    poseWorker.onmessage = e => {
      const { type, poseLandmarks, error } = e.data;
      if (type === 'results') {
        const status = estimatePose(poseLandmarks, canvasRef, myVideoRef);
        setMyMissionStatus(status);
        setIsGameLoading(false);
      } else if (type === 'error') {
        console.error('Error from worker:', error);
      }
    };

    poseWorker.postMessage({ command: 'load' });

    return () => poseWorker.terminate();
  }, []);

  useEffect(() => {
    if (!worker || inGameMode !== 1 || !myVideoRef.current) return;

    const videoElement = myVideoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const handleCanPlay = () => {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      worker.postMessage(
        {
          command: 'send',
          image: imageData.data.buffer,
        },
        [imageData.data.buffer],
      );
    };

    if (videoElement.readyState >= 3) {
      handleCanPlay();
    }

    videoElement.addEventListener('canplay', handleCanPlay);

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
    };
  }, [worker, inGameMode, myVideoRef]);

  return <Canvas ref={canvasRef} />;
};

export default Mission1;

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;
