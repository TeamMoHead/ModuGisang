import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  MediaPipeContext,
  GameContext,
  OpenViduContext,
} from '../../../contexts';
import { MissionStarting, MissionEnding } from '../components';
import { estimateHead } from '../MissionEstimators/HeadEstimator';
import arrow from '../../../assets/arrows/arrow.svg';
import { RoundSoundEffect, MissionSoundEffects } from '../Sound';

import styled from 'styled-components';

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
  const { poseModel, setIsPoseLoaded, setIsPoseInitialized } =
    useContext(MediaPipeContext);
  const {
    isMissionStarting,
    isMissionEnding,
    inGameMode,
    myMissionStatus,
    setMyMissionStatus,
    setGameScore,
  } = useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);
  const canvasRef = useRef(null);

  // 화살표 세팅
  const [arrowRound, setArrowRound] = useState({
    0: round1,
    1: round2,
  });
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [currentArrowIdx, setCurrentArrowIdx] = useState(0);
  const [isMissionFinished, setIsMissionFinished] = useState(false);
  const score = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGameScore(prev => prev + score.current);
      setIsMissionFinished(true);
    }, 17000);
    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
  }, []);

  useEffect(() => {
    if (
      inGameMode !== 3 ||
      !myVideoRef.current ||
      !poseModel.current ||
      isMissionStarting
    ) {
      return;
    }
    const videoElement = myVideoRef.current;

    const handleCanPlay = () => {
      if (poseModel.current !== null) {
        poseModel.current.send({ image: videoElement }).then(() => {
          requestAnimationFrame(handleCanPlay);
        });
      }
    };

    if (videoElement.readyState >= 3) {
      handleCanPlay();
    } else {
      videoElement.addEventListener('canplay', handleCanPlay);
    }

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      poseModel.current = null;
      setIsPoseLoaded(false);
      setIsPoseInitialized(false);
    };
  }, [isMissionStarting, poseModel]);

  useEffect(() => {
    if (isMissionFinished) {
      return;
    }
    if (!poseModel.current || isMissionStarting) return;

    const direction = arrowRound[currentRoundIdx][currentArrowIdx].direction;
    if (myMissionStatus) {
      score.current = 25;
    } else if (currentRoundIdx === 1) {
      score.current = 12 + (currentArrowIdx + 1) * 3 - 3;
    } else if (currentRoundIdx === 0) {
      score.current = (currentArrowIdx + 1) * 3 - 3;
    }
    // console.log('score : ', score.current);
    poseModel.current.onResults(results => {
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
          setCurrentArrowIdx(0); // 첫 번째 화살표로 초기화
          setMyMissionStatus(true); // 성공
          score.current = 25;
        } else if (currentRoundIdx === 0 && currentArrowIdx === 3) {
          setCurrentArrowIdx(0); // 첫 번째 화살표로 초기화
          setTimeout(() => {
            setCurrentRoundIdx(currentRoundIdx + 1); // 다음 라운드로 넘어감
          }, 1000); // 1초 뒤에 실행되도록 설정
        } else {
          setCurrentArrowIdx(currentArrowIdx + 1); // 다음 화살표로 이동
        }
      }
    });
  }, [
    isMissionStarting,
    currentRoundIdx,
    currentArrowIdx,
    arrowRound,
    myMissionStatus,
  ]);

  useEffect(() => {
    if (!isMissionStarting) {
      RoundSoundEffect();
    }
  }, [currentArrowIdx]);

  return (
    <>
      <MissionStarting />
      {isMissionEnding && <MissionEnding />}
      {isMissionEnding && <MissionSoundEffects />}
      {isMissionStarting || (
        <>
          <Canvas ref={canvasRef} />
          <ArrowBox>
            {arrowRound[currentRoundIdx].map(({ id, direction, active }) => (
              <Arrows
                key={`${id}_${active}`}
                src={arrow}
                direction={direction}
                active={active}
                alt={id}
              />
            ))}
          </ArrowBox>
        </>
      )}
    </>
  );
};

export default Mission3;

const Canvas = styled.canvas`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.radius.medium};
`;

const ArrowBox = styled.div`
  z-index: 200;

  position: absolute;
  bottom: 25px;

  width: calc(100% - 6px);
  height: 60px;
  padding: 0 10px;

  ${({ theme }) => theme.flex.between}

  background-color: ${({ theme }) => theme.colors.translucent.lightNavy};
`;

const Arrows = styled.img`
  width: 80px;
  height: 50px;
  transform: ${({ direction }) =>
    direction === 'top'
      ? 'rotate(-90deg)'
      : direction === 'bottom'
        ? 'rotate(90deg)'
        : direction === 'left'
          ? 'rotate(180deg)'
          : 'rotate(0deg)'};

  filter: ${({ active }) => (active ? 'none' : 'grayscale(100%)')};
`;
