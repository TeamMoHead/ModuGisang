import React, { useRef, useEffect, useContext, useState } from 'react';
import { GameContext, OpenViduContext } from '../../../contexts';
import { Pose } from '@mediapipe/pose';
import { estimateHead } from '../MissionEstimators/HeadEstimator';
import bottomArrow from '../../../assets/arrows/bottom.svg';
import topArrow from '../../../assets/arrows/top.svg';
import leftArrow from '../../../assets/arrows/left.svg';
import rightArrow from '../../../assets/arrows/right.svg';

import styled from 'styled-components';

const arrowImages = {
  top: topArrow,
  bottom: bottomArrow,
  left: leftArrow,
  right: rightArrow,
};

const round1 = [
  { id: 0, direction: 'top', active: false },
  { id: 1, direction: 'bottom', active: false },
  { id: 2, direction: 'left', active: false },
  { id: 3, direction: 'right', active: false },
];

const round2 = [
  { id: 4, direction: 'bottom', active: false },
  { id: 5, direction: 'right', active: false },
  { id: 6, direction: 'left', active: false },
  { id: 7, direction: 'right', active: false },
];

const Mission3 = () => {
  const {
    inGameMode,
    myMissionStatus,
    setMyMissionStatus,
    isGameLoading,
    setIsGameLoading,
  } = useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);
  const canvasRef = useRef(null);
  const msPoseRef = useRef(null);

  // 화살표 세팅
  const [arrowRound, setArrowRound] = useState({
    0: round1,
    1: round2,
  });
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [currentArrowIdx, setCurrentArrowIdx] = useState(0);

  useEffect(() => {
    if (inGameMode !== 3 || !myVideoRef.current) return;

    const videoElement = myVideoRef.current;

    msPoseRef.current = new Pose({
      locateFile: file =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    msPoseRef.current.setOptions({
      modelComplexity: 1,
      selfieMode: true,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const handleCanPlay = () => {
      let frameCount = 0;
      const frameSkip = 150;

      if (frameCount % (frameSkip + 1) === 0) {
        if (msPoseRef.current !== null) {
          msPoseRef.current.send({ image: videoElement }).then(() => {
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
      msPoseRef.current = null;
    };
  }, [inGameMode, myVideoRef]);

  useEffect(() => {
    if (!msPoseRef.current) return;

    const direction = arrowRound[currentRoundIdx][currentArrowIdx].direction;

    msPoseRef.current.onResults(results => {
      const result = estimateHead({
        results,
        myVideoRef,
        canvasRef,
        direction,
      });

      if (result) {
        setArrowRound(prevState => {
          const newState = { ...prevState };
          newState[currentRoundIdx][currentArrowIdx].active = true;
          return newState;
        });

        if (currentRoundIdx === 1 && currentArrowIdx === 3) {
          setMyMissionStatus(true);
        } else if (currentRoundIdx === 0 && currentArrowIdx === 3) {
          setCurrentRoundIdx(currentRoundIdx + 1); // 다음 라운드로 넘어감
          setCurrentArrowIdx(0); // 첫 번째 화살표로 초기화
        } else {
          setCurrentArrowIdx(currentArrowIdx + 1); // 다음 화살표로 이동
        }
      }

      if (isGameLoading) setIsGameLoading(false);
    });
  }, [currentRoundIdx, currentArrowIdx, arrowRound, myMissionStatus]);

  return (
    <>
      <Canvas ref={canvasRef} />
      <ArrowBox>
        {arrowRound[currentRoundIdx].map(({ id, direction, active }) => (
          <Arrows
            key={`${id}_${active}`}
            src={arrowImages[direction]}
            active={active}
            alt={id}
          />
        ))}

        {/* <Arrows src={leftArrow} alt="bottomArrow" />
        <Arrows src={bottomArrow} alt="bottomArrow" />
        <Arrows src={topArrow} alt="bottomArrow" />
        <Arrows src={bottomArrow} alt="bottomArrow" /> */}
      </ArrowBox>
    </>
  );
};

export default Mission3;

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;

const ArrowBox = styled.div`
  position: fixed;
  top: 150px;
  width: 100%;
  height: 100px;
  ${({ theme }) => theme.flex.between}
  background-color: ${({ theme }) => theme.colors.lighter.dark};
`;

const Arrows = styled.img`
  width: 80px;
  height: 50px;
  filter: ${({ active }) =>
    active ? 'hue-rotate(60deg) saturate(200%)' : 'none'};
`;
