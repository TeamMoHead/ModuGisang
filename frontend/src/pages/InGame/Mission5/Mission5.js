import React, { useContext, useEffect, useState } from 'react';
import {
  MediaPipeContext,
  GameContext,
  OpenViduContext,
} from '../../../contexts';
import * as pose from '@mediapipe/pose';
import { MissionStarting, MissionEnding } from '../components';
import CustomAnswerImg from './CustomAnswerImg';
import styled from 'styled-components';

const tables = {
  0: {
    question: '3 X 7',
    correct: '21',
    wrong: '12',
    direction: 2, // 0 표시 안 함, 1 왼쪽이 정답, 2 오른쪽이 정답
    score: 1,
  },
  1: {
    question: '5 X 5',
    correct: '25',
    wrong: '35',
    direction: 2,
    score: 1,
  },
  2: {
    question: '10 X 11',
    correct: '110',
    wrong: '101',
    direction: 1,
    score: 2,
  },
  3: {
    question: '13 X 13',
    correct: '169',
    wrong: '196',
    direction: 1,
    score: 2,
  },
  4: {
    question: '32 X 28',
    correct: '896',
    wrong: '616',
    direction: 2,
    score: 4,
  },
  5: {
    question: '미션 종료!',
    correct: '0',
    wrong: '0',
    direction: 0,
    score: 0,
  },
};

let isHandDownCount = 0; // 손을 계속 들고 있을 때 대비
let isWaiting = false;
let isMissionFinished = false;
let isGameStart = false;
let totalScore = 0;
const timeoutDuration = 22000; // 제한 시간

const Mission5 = () => {
  const { poseModel, setIsPoseLoaded, setIsPoseInitialized } =
    useContext(MediaPipeContext);
  const {
    isMissionStarting,
    isMissionEnding,
    inGameMode,
    myMissionStatus,
    setMyMissionStatus,
    setIsRoundPassed,
    setIsRoundFailed,
    setGameScore,
  } = useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);

  const [roundIdx, setRoundIdx] = useState(0);
  const [hand, setHand] = useState(0); // 0 없음, 1 왼손, 2 오른손

  const getColor = direction => {
    if (direction === hand) return '#15F5BA';
    return '#FF008F';
  };

  const multipleGame = poseLandmarks => {
    if (!poseLandmarks || isMissionFinished || isWaiting || myMissionStatus) {
      return;
    }

    const mouth = poseLandmarks[pose.POSE_LANDMARKS.LEFT_RIGHT];
    const left = poseLandmarks[pose.POSE_LANDMARKS.LEFT_WRIST];
    const right = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_WRIST];

    if (isHandDownCount > 50 && mouth.y < left.y && mouth.y > right.y) {
      setHand(1);
      isHandDownCount = 0;
    } else if (isHandDownCount > 50 && mouth.y > left.y && mouth.y < right.y) {
      setHand(2);
      isHandDownCount = 0;
      // } else if (nose.y < left.y && nose.y < right.y) {
    } else {
      setHand(0);
      isHandDownCount += 1;
    }
  };

  useEffect(() => {
    if (isMissionFinished || !poseModel.current || isMissionStarting) return;

    poseModel.current.onResults(results => {
      multipleGame(results.poseLandmarks);
    });

    const direction = tables[roundIdx].direction;
    if (hand > 0) {
      isWaiting = true;

      if (hand === direction) {
        setIsRoundPassed(true);
        setTimeout(() => setIsRoundPassed(false), 100);
        setGameScore(prev => prev + tables[roundIdx].score);
        totalScore += tables[roundIdx].score;
      } else {
        setIsRoundFailed(true);
        setTimeout(() => setIsRoundFailed(false), 100);
      }

      setTimeout(() => {
        if (roundIdx >= Object.keys(tables).length - 2) {
          isMissionFinished = true;
          setRoundIdx(Object.keys(tables).length - 1);
          if (totalScore >= 10) setMyMissionStatus(true);
        } else setRoundIdx(prev => prev + 1);
        setHand(0);
        isWaiting = false;
      }, 1000);
    }
  }, [isMissionStarting, hand, roundIdx, myMissionStatus]);

  useEffect(() => {
    if (
      inGameMode !== 5 ||
      !myVideoRef.current ||
      !poseModel.current ||
      isMissionStarting
    ) {
      return;
    }

    const handleTimeout = () => {
      isMissionFinished = true;
    };

    if (!isGameStart) {
      isGameStart = true;
      setTimeout(handleTimeout, timeoutDuration);
    }

    const videoElement = myVideoRef.current;

    const handleCanPlay = () => {
      if (poseModel.current) {
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

  return (
    <>
      <MissionStarting />
      {isMissionEnding && <MissionEnding />}
      {isMissionStarting || (
        <>
          <Wrapper>
            <FormulaWrapper>
              <Formula>{tables[roundIdx].question}</Formula>
            </FormulaWrapper>
            <AnswerBox>
              {tables[roundIdx].direction !== 0 && (
                <Answer alt="left">
                  <CustomAnswerImg
                    selected={hand === 1}
                    color={
                      hand === 1
                        ? getColor(tables[roundIdx].direction)
                        : '#808080'
                    }
                  />
                  <AnswerText>
                    {tables[roundIdx].direction === 1
                      ? tables[roundIdx].correct
                      : tables[roundIdx].wrong}
                  </AnswerText>
                </Answer>
              )}
              {tables[roundIdx].direction !== 0 && (
                <Answer alt="right">
                  <CustomAnswerImg
                    selected={hand === 2}
                    color={
                      hand === 2
                        ? getColor(tables[roundIdx].direction)
                        : '#808080'
                    }
                  />
                  <AnswerText>
                    {tables[roundIdx].direction === 2
                      ? tables[roundIdx].correct
                      : tables[roundIdx].wrong}
                  </AnswerText>
                </Answer>
              )}
            </AnswerBox>
          </Wrapper>
        </>
      )}
    </>
  );
};

export default Mission5;

const Wrapper = styled.div`
  z-index: 200;

  position: absolute;

  width: 100%;
  height: 100%;
`;

const FormulaWrapper = styled.div`
  position: absolute;
  left: 3px;
  bottom: 3px;

  width: calc(100% - 6px);
  height: 80px;
  padding: 0 10px;

  ${({ theme }) => theme.flex.center};

  border-radius: 0 0 ${({ theme }) => theme.radius.medium}
    ${({ theme }) => theme.radius.medium};
  background-color: ${({ theme }) => theme.colors.translucent.navy};
`;

const Formula = styled.div`
  ${({ theme }) => theme.fonts.JuaMedium};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const AnswerBox = styled.div`
  z-index: 200;

  position: absolute;
  top: 10px;

  width: calc(100% - 6px);
  height: 120px;
  padding: 0 20px;

  ${({ theme }) => theme.flex.between}
`;

const Answer = styled.div`
  position: relative;
  width: 110px;
  height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AnswerText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -5%);
  ${({ theme }) => theme.fonts.JuaMedium};
  -webkit-text-stroke: var(--Dark, #0d0a2d) 2px;
`;
