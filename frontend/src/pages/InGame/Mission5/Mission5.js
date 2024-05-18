import React, { useRef, useContext, useEffect, useState } from 'react';
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
    question: '6 X 2',
    correct: '12',
    wrong: '42',
    direction: 1,
    score: 1,
  },
  3: {
    question: '4 X 8',
    correct: '32',
    wrong: '23',
    direction: 2,
    score: 1,
  },
  4: {
    question: '9 X 6',
    correct: '54',
    wrong: '48',
    direction: 2,
    score: 2,
  },
  5: {
    question: '10 X 11',
    correct: '110',
    wrong: '101',
    direction: 1,
    score: 2,
  },
  6: {
    question: '13 X 13',
    correct: '169',
    wrong: '196',
    direction: 1,
    score: 2,
  },
  7: {
    question: '15 X 5',
    correct: '75',
    wrong: '196',
    direction: 2,
    score: 2,
  },
  8: {
    question: '23 X 17',
    correct: '391',
    wrong: '401',
    direction: 1,
    score: 4,
  },
  9: {
    question: '32 X 28',
    correct: '896',
    wrong: '616',
    direction: 1,
    score: 4,
  },
  10: {
    question: '미션 종료!',
    correct: '0',
    wrong: '0',
    direction: 0,
    score: 0,
  },
};

let raisingHand = 0;
let isHandDownCount = 0; // 손을 계속 들고 있을 때 대비
let isWaiting = false;
let isMissionFinished = false;
let totalScore = 0;

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
    if (direction === 1) {
      if (hand === 1) return '#008000';
      if (hand === 2) return '#FF00000';
    }
    if (direction === 2 && hand === 2) {
      if (hand === 1) return '#FF0000';
      if (hand === 2) return '#008000';
    }
    return '#808080';
  };

  const multipleGame = poseLandmarks => {
    if (!poseLandmarks || isMissionFinished || isWaiting || myMissionStatus) {
      return;
    }

    const nose = poseLandmarks[pose.POSE_LANDMARKS.NOSE];
    const left = poseLandmarks[pose.POSE_LANDMARKS.LEFT_WRIST];
    const right = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_WRIST];

    if (isHandDownCount > 50 && nose.y < left.y && nose.y > right.y) {
      setHand(1);
      raisingHand = 1; // 왼손을 들고 있음
      isHandDownCount = 0;
    } else if (isHandDownCount > 50 && nose.y > left.y && nose.y < right.y) {
      setHand(2);
      raisingHand = 2; // 오른손을 들고 있음
      isHandDownCount = 0;
      // } else if (nose.y < left.y && nose.y < right.y) {
    } else {
      setHand(0);
      raisingHand = 0;
      isHandDownCount += 1;
    }

    const direction = tables[roundIdx].direction;
    if (raisingHand > 0) {
      isWaiting = true;

      if (raisingHand === direction) {
        setIsRoundPassed(true);
        setTimeout(() => setIsRoundPassed(false), 100);
        console.log('----- CORRECT !');
        setGameScore(prev => prev + tables[roundIdx].score);
        totalScore += tables[roundIdx].score;
        console.log('----- score: ', totalScore);
      } else {
        setIsRoundFailed(true);
        setTimeout(() => setIsRoundFailed(false), 100);
        console.log('----- STUPID !');
      }

      setTimeout(() => {
        setIsRoundPassed(true);
        if (roundIdx >= Object.keys(tables).length - 2) {
          isMissionFinished = true;
          setRoundIdx(Object.keys(tables).length - 1);
          if (totalScore >= 10) setMyMissionStatus(true);
        } else setRoundIdx(prev => prev + 1);
        setHand(0);
        raisingHand = 0;
        isWaiting = false;
      }, 2000);
    }
  };

  useEffect(() => {
    if (
      inGameMode !== 5 ||
      !myVideoRef.current ||
      !poseModel.current ||
      isMissionStarting
    ) {
      return;
    }

    const videoElement = myVideoRef.current;

    poseModel.current.onResults(results => {
      if (results.poseLandmarks) {
        multipleGame(results.poseLandmarks);
      }
    });

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
                    color={getColor(tables[roundIdx].direction)}
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
                    color={getColor(tables[roundIdx].direction)}
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

  width: calc(100% - 16px);
  height: 120px;
  padding: 0 30px;

  ${({ theme }) => theme.flex.between}
`;

const Answer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
`;

const AnswerText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-30%, 15%);
  ${({ theme }) => theme.fonts.JuaMedium};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
`;
