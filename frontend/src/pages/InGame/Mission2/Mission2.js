import React, { useEffect, useRef, useContext } from 'react';
import { GameContext, OpenViduContext } from '../../../contexts';
import { Holistic } from '@mediapipe/holistic';
// import * as face from '@mediapipe/face_mesh';
import { estimateFace } from '../MissionEstimators/FaceEstimator';
import styled from 'styled-components';

const Mission2 = () => {
  const {
    inGameMode,
    myMissionStatus,
    setMyMissionStatus,
    isGameLoading,
    setIsGameLoading,
  } = useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);
  const canvasRef = useRef(null);
  const holisticRef = useRef(null);

  useEffect(() => {
    if (inGameMode !== 2 || !myVideoRef.current) return;

    const videoElement = myVideoRef.current;

    // Face만 탐지하는데도 현재 holistic를 쓰고 있습니다 (사유: 라인 그리기, 인덱싱)
    // faceRef.current = new face.FaceMesh({
    //   locateFile: file => {
    //     return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    //   },
    // });

    holisticRef.current = new Holistic({
      locateFile: file => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    holisticRef.current.setOptions({
      selfieMode: true,
      numFaces: 1,
      refineFaceLandmarks: false, // Attention Mesh Model 적용 여부
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holisticRef.current.onResults(results => {
      setMyMissionStatus(estimateFace({ results, myVideoRef, canvasRef }));
      if (isGameLoading) setIsGameLoading(false);
    });

    const handleCanPlay = () => {
      let frameCount = 0;
      const frameSkip = 150;

      if (frameCount % (frameSkip + 1) === 0) {
        if (holisticRef.current !== null) {
          holisticRef.current.send({ image: videoElement }).then(() => {
            requestAnimationFrame(handleCanPlay);
          });
        }
      }

      frameCount++;
    };

    if (videoElement.readyState >= 3) {
      handleCanPlay();
    } else {
      videoElement.addEventListener('canplay', handleCanPlay);
    }

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      holisticRef.current = null;
    };
  }, []);

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
