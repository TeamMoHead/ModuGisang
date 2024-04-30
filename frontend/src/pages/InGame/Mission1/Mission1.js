import React, { useEffect, useRef, useContext } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import { FaceMesh } from '@mediapipe/face_mesh';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

const GameMode1MediaPipe = () => {
  const { myVideoRef } = useContext(GameContext);
  const canvasRef = useRef(null);

  const setupMediaPipeFaceMesh = () => {
    const faceMesh = new FaceMesh({
      locateFile: file =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    return faceMesh;
  };

  const drawFaceMeshResults = (ctx, results) => {
    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        drawConnectors(ctx, landmarks, FaceMesh.FACEMESH_TESSELATION, {
          color: '#C0C0C070',
          lineWidth: 1,
        });
        drawConnectors(ctx, landmarks, FaceMesh.FACEMESH_RIGHT_EYE, {
          color: '#FF3030',
        });
        drawConnectors(ctx, landmarks, FaceMesh.FACEMESH_RIGHT_EYEBROW, {
          color: '#FF3030',
        });
        drawLandmarks(ctx, landmarks, { color: '#FF3030', radius: 1 });
      }
    }
  };

  useEffect(() => {
    // 가정: faceMesh가 이미 설정되어 있고, 여기서 사용한다.
    const faceMesh = setupMediaPipeFaceMesh(); // MediaPipe 설정 함수
    faceMesh.onResults(results => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = myVideoRef.current.videoWidth;
      canvas.height = myVideoRef.current.videoHeight;

      drawFaceMeshResults(ctx, results); // 결과 그리기 함수
    });

    if (myVideoRef.current) {
      faceMesh.send({ video: myVideoRef.current });
    }

    return () => {
      faceMesh.close(); // 사용이 끝나면 리소스 정리
    };
  }, [myVideoRef]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0 }} />;
};

export default GameMode1MediaPipe;
