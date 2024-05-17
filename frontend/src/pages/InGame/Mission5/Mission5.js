import React, { useRef, useContext, useEffect, useState } from 'react';
import {
  MediaPipeContext,
  GameContext,
  OpenViduContext,
} from '../../../contexts';
import * as pose from '@mediapipe/pose';
import { MissionStarting, MissionEnding } from '../components';
import arrow from '../../../assets/arrows/arrow.svg';
import styled from 'styled-components';

const tables = {
  0: {
    question: '8 X 6',
    correct: '48',
    wrong: '42',
    direction: 2, // 1 왼쪽, 2 오른쪽
    score: 5,
  },
  1: {
    question: '13 X 13',
    correct: '169',
    wrong: '196',
    direction: 1,
    score: 7,
  },
  2: {
    question: '23 X 17',
    correct: '391',
    wrong: '401',
    direction: 2,
    score: 8,
  },
};

let raisingHand = false;
let isMissionFinished = false;
let isWaiting = false;

const Mission5 = () => {
  const { poseModel } = useContext(MediaPipeContext);
  const {
    isMissionStarting,
    isMissionEnding,
    inGameMode,
    myMissionStatus,
    setMyMissionStatus,
    setIsRoundPassed,
    setGameScore,
  } = useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);

  const [isCorrect, setIsCorrect] = useState(false);
  const [roundIdx, setRoundIdx] = useState(0);

  const [hand, setHand] = useState(0); // 0 없음, 1 왼손, 2 오른손
  const score = useRef(0);

  const multipleGame = poseLandmarks => {
    if (!poseLandmarks || isMissionFinished || isWaiting || myMissionStatus) {
      console.log('----- Check point');
      return;
    }

    const nose = poseLandmarks[pose.POSE_LANDMARKS.NOSE];
    const left = poseLandmarks[pose.POSE_LANDMARKS.LEFT_WRIST];
    const right = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_WRIST];

    if (nose.y < left.y && nose.y > right.y) {
      setHand(1);
      raisingHand = 1; // 왼손을 들고 있음
    } else if (nose.y > left.y && nose.y < right.y) {
      setHand(2);
      raisingHand = 2; // 오른손을 들고 있음
    } else {
      setHand(0);
      raisingHand = false; // 그 외면 false로 초기화
    }

    const direction = tables[roundIdx].direction;
    if (hand === direction) {
      isWaiting = true;
      setIsCorrect(true);
      console.log('----- CORRECT !');
      setGameScore(prev => prev + tables[roundIdx].score);

      setTimeout(() => {
        setIsRoundPassed(true);
        if (roundIdx === 2) setMyMissionStatus(true);
        else setRoundIdx(prev => prev + 1);
        setIsCorrect(false);
        isWaiting = false;
      }, 3000); // 3초 후에 다음 라운드로 넘어감
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
    let animationFrameId;

    poseModel.current.onResults(results => {
      if (results.poseLandmarks) {
        multipleGame(results.poseLandmarks);
      }
    });

    const handleCanPlay = () => {
      if (poseModel.current) {
        poseModel.current.send({ image: videoElement }).then(() => {
          animationFrameId = requestAnimationFrame(handleCanPlay);
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
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMissionStarting, poseModel, inGameMode, myVideoRef, roundIdx]);

  return (
    <>
      <MissionStarting />
      {isMissionEnding && <MissionEnding />}
      {isMissionStarting || (
        <>
          <Wrapper>
            <FormulaWrapper>
              <Formula>{tables[roundIdx].question} = ?</Formula>
            </FormulaWrapper>
            {isCorrect && (
              <RoundPassStatus $isCorrect={isCorrect}>정답!</RoundPassStatus>
            )}
            <AnswerBox>
              <Answer alt="left">
                <AnswerImage src={arrow} active={hand === 1} />
                <AnswerText>
                  {tables[roundIdx].direction === 1
                    ? tables[roundIdx].correct
                    : tables[roundIdx].wrong}
                </AnswerText>
              </Answer>
              <Answer alt="right">
                <AnswerImage src={arrow} active={hand === 2} />
                <AnswerText>
                  {tables[roundIdx].direction === 2
                    ? tables[roundIdx].correct
                    : tables[roundIdx].wrong}
                </AnswerText>
              </Answer>
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

const RoundPassStatus = styled.div`
  z-index: 600;
  position: absolute;

  width: 100vw;
  height: 100vh;

  ${({ theme }) => theme.flex.center};

  font: 700 50px 'Jua';

  color: ${({ theme }) => theme.colors.system.white};
  -webkit-text-stroke: ${({ theme, $isCorrect }) =>
      $isCorrect ? theme.colors.primary.emerald : theme.colors.system.red}
    4px;
`;

const AnswerBox = styled.div`
  z-index: 200;

  position: absolute;
  bottom: 90px;

  width: calc(100% - 6px);
  height: 90px;
  padding: 0 20px;

  ${({ theme }) => theme.flex.between}
`;

const Answer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
`;

const AnswerImage = styled.img`
  width: 100%;
  height: 100%;
  filter: ${({ active }) => (active ? 'none' : 'grayscale(100%)')};
`;

const AnswerText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${({ theme }) => theme.fonts.JuaMedium};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
`;

const CORRECT_ICON_STYLE = {
  size: 40,
  color: 'emerald',
  hoverColor: 'emerald',
};

const WRONG_ICON_STYLE = {
  size: 40,
  color: 'red',
  hoverColor: 'red',
};
