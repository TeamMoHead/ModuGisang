import React, { useEffect, useRef, useContext } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import { Holistic } from '@mediapipe/holistic';
// import * as face from '@mediapipe/face_mesh';
import { estimateFace } from '../MissionEstimators/FaceEstimator';
import styled from 'styled-components';

const Mission2 = () => {
  const { myVideoRef } = useContext(GameContext);
  const canvasRef = useRef(null);
  const faceRef = useRef(null);

  useEffect(() => {
    const videoElement = myVideoRef.current;

    // Face만 탐지하는데도 현재 holistic를 쓰고 있습니다 (사유: 라인 그리기, 인덱싱)
    // faceRef.current = new face.FaceMesh({
    //   locateFile: file => {
    //     return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    //   },
    // });

    faceRef.current = new Holistic({
      locateFile: file => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    faceRef.current.setOptions({
      selfieMode: true,
      numFaces: 1,
      refineFaceLandmarks: false, // Attention Mesh Model 적용 여부
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceRef.current.onResults(results =>
      estimateFace({ results, myVideoRef, canvasRef }),
    );

    const handleCanPlay = () => {
      faceRef.current.send({ image: videoElement }).then(() => {
        requestAnimationFrame(handleCanPlay);
      });
    };

    videoElement.addEventListener('canplay', handleCanPlay);

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      faceRef.current.close();
    };
  }, [myVideoRef]);

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
