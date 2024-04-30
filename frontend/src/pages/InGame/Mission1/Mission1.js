import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera } from '@mediapipe/camera_utils';
import { FACEMESH_TESSELATION, Holistic } from '@mediapipe/holistic';
import { drawConnectors } from '@mediapipe/drawing_utils';

function Mission1() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [prevLeftCheekPosition, setPrevLeftCheekPosition] = useState(null);
  const [prevRightCheekPosition, setPrevRightCheekPosition] = useState(null);

  const onResults = results => {
    if (!webcamRef.current?.video || !canvasRef.current) return;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

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

  console.log(
    'OutSide of the func::  ',
    prevLeftCheekPosition,
    prevRightCheekPosition,
  );

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

    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null
    ) {
      if (!webcamRef.current?.video) return;

      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (!webcamRef.current?.video) return;
          await holistic.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }

    return () => {
      if (holistic) {
        holistic.close();
      }
    };
  }, []);

  return (
    <div className="App" style={{ width: '100%', height: '100%' }}>
      <div style={{ position: 'relative', width: 1200, height: 800 }}>
        <Webcam
          ref={webcamRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 1200,
            height: 800,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 1200,
            height: 800,
          }}
        />
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
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 20,
            color: 'white',
            zIndex: 10,
          }}
        >
          {prevRightCheekPosition && (
            <p>
              Previous Right Cheek Position: X ={' '}
              {prevRightCheekPosition.x.toFixed(2)}, Y ={' '}
              {prevRightCheekPosition.y.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mission1;
