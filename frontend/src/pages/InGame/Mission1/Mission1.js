import React, { useRef, useEffect, useContext } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import * as pose from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import styled from 'styled-components';

const GameMode1MediaPipe = () => {
  const { myVideoRef } = useContext(GameContext);
  const canvasRef = useRef(null);

  useEffect(() => {
    const mpPose = new pose.Pose({
      locateFile: file =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    mpPose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    mpPose.onResults(results => {
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext('2d');
      canvasElement.width = myVideoRef.current.videoWidth;
      canvasElement.height = myVideoRef.current.videoHeight;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height,
      );

      drawConnectors(canvasCtx, results.poseLandmarks, pose.POSE_CONNECTIONS, {
        color: '#FFFFFF',
        lineWidth: 4,
      });
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: '#F0A000',
        radius: 2,
      });
      canvasCtx.restore();
    });

    if (myVideoRef.current) {
      const camera = new Camera(myVideoRef.current, {
        onFrame: async () => {
          await mpPose.send({ image: myVideoRef.current });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }

    return () => {
      mpPose.close();
    };
  }, [myVideoRef]);

  return <Canvas ref={canvasRef} />;
};

export default GameMode1MediaPipe;

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;
