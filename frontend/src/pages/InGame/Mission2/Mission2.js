import React, { useEffect, useRef, useState, useContext } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import { Camera } from '@mediapipe/camera_utils';
import { FACEMESH_TESSELATION, Holistic } from '@mediapipe/holistic';
import { drawConnectors } from '@mediapipe/drawing_utils';
import styled from 'styled-components';

const Mission2 = () => {
  const { myVideoRef } = useContext(GameContext);
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [prevLeftCheekPosition, setPrevLeftCheekPosition] = useState(null);
  const [prevRightCheekPosition, setPrevRightCheekPosition] = useState(null);

  const onResults = results => {
    if (!myVideoRef.current || !canvasRef.current) return;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    if (canvasCtx == null) throw new Error('Could not get context');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Only overwrite existing pixels.
    canvasCtx.globalCompositeOperation = 'source-in';
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = 'destination-atop';
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height,
    );

    canvasCtx.globalCompositeOperation = 'source-over';
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
      color: '#C0C0C070',
      lineWidth: 1,
    });

    // Check left cheek movement
    const leftCheekIndex = 205; // Left cheek landmark index
    const leftCheek = results.faceLandmarks[leftCheekIndex];
    if (leftCheek) {
      if (prevLeftCheekPosition) {
        const deltaLeftY = leftCheek.y - prevLeftCheekPosition.y;
        // console.log('deltaLeftY:', leftCheek.y - prevLeftCheekPosition.y);
        if (Math.abs(deltaLeftY) > 0.01) {
          // Threshold for detecting movement, adjust as needed
          setScore(score => score + 1);
        }
      }
      setPrevLeftCheekPosition({ x: leftCheek.x, y: leftCheek.y });
      // console.log('prevLeftCheekPosition:', { x: leftCheek.x, y: leftCheek.y });
    }

    // Check right cheek movement
    const rightCheekIndex = 425; // Right cheek landmark index
    const rightCheek = results.faceLandmarks[rightCheekIndex];
    console.log('----right cheek:  ', rightCheek);
    if (rightCheek) {
      // Set previous right cheek position
      if (prevRightCheekPosition) {
        const deltaRightY = rightCheek.y - prevRightCheekPosition.y;
        console.log('----deltaRightY:', deltaRightY);
        if (Math.abs(deltaRightY) > 0.01) {
          // Threshold for detecting movement, adjust as needed
          setScore(score => score + 1);
        }
      } else {
        console.log('----계산 안 되었음!!!!!!!');
      }
      setPrevRightCheekPosition({ x: rightCheek.x, y: rightCheek.y });
      console.log('prevRightCheekPosition:', {
        x: rightCheek.x,
        y: rightCheek.y,
      });
    }

    canvasCtx.restore();
  };

  useEffect(() => {
    const holistic = new Holistic({
      locateFile: file => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    holistic.setOptions({
      selfieMode: true,
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holistic.onResults(onResults);

    if (myVideoRef.current) {
      const camera = new Camera(myVideoRef.current, {
        onFrame: async () => {
          await holistic.send({ image: myVideoRef.current });
        },
      });
      camera.start();
    }

    return () => {
      if (holistic) {
        holistic.close();
      }
    };
  }, [myVideoRef.current]);

  return <Canvas ref={canvasRef} />;
};

export default Mission2;

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;
