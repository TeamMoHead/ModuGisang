import React, { createContext, useState, useEffect, useRef } from 'react';
import { Pose } from '@mediapipe/pose';
import { Holistic } from '@mediapipe/holistic';

const MediaPipeContext = createContext();

const MediaPipeContextProvider = ({ children }) => {
  const poseModel = useRef(null);
  const holisticModel = useRef(null);
  const [isPoseLoaded, setIsPoseLoaded] = useState(false);
  const [isPoseInitialized, setIsPoseInitialized] = useState(false);
  const [isHolisticLoaded, setIsHolisticLoaded] = useState(false);

  useEffect(() => {
    poseModel.current = new Pose({
      locateFile: file => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    poseModel.current.setOptions({
      modelComplexity: 1,
      selfieMode: true,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    setIsPoseLoaded(true);
  }, []);

  useEffect(() => {
    if (!isPoseInitialized) return;

    holisticModel.current = new Holistic({
      locateFile: file => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    holisticModel.current.setOptions({
      selfieMode: true,
      numFaces: 1,
      refineFaceLandmarks: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    setIsHolisticLoaded(true);
  }, [isPoseInitialized]);

  return (
    <MediaPipeContext.Provider
      value={{
        isPoseLoaded,
        setIsPoseInitialized,
        isHolisticLoaded,
        poseModel,
        holisticModel,
      }}
    >
      {children}
    </MediaPipeContext.Provider>
  );
};

export { MediaPipeContext, MediaPipeContextProvider };
