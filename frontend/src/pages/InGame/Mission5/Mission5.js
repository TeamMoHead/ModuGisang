import React, { useContext, useEffect, useState } from 'react';
import { MissionStarting, MissionEnding } from '../components';
import {
  MediaPipeContext,
  GameContext,
  OpenViduContext,
} from '../../../contexts';

import styled from 'styled-components';
import { Icon } from '../../../components';

const round = {
  0: { question: '8 X 6', answer: '48', wrong: '42', score: 5 },
  1: { question: '13 X 13', answer: '169', wrong: '196', score: 7 },
  2: { question: '23 X 17', answer: '391', wrong: '401', score: 8 },
};

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
  const { transcript, stop, resetTranscript } = useSpeechToText(20);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeIndex, setTimeIndex] = useState(0);
  const [rasingHand, setRasingHand] = useState();
  const [currentRound, setCurrentRound] = useState(0);

  const multipleGame = poseLandmarks => {
    if (!poseLandmarks) return;
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
  }, [isMissionStarting, poseModel, inGameMode, myVideoRef, currentRound]);

  useEffect(() => {
    const trimmedTranscript = transcript.trim();
    console.log('====MISSION5 ====> ', trimmedTranscript);

    if (trimmedTranscript === round[timeIndex].answer) {
      setIsCorrect(true);
      setIsRoundPassed(true);

      setTimeout(() => {
        setIsRoundPassed(false);
        setIsCorrect(false);
      }, 100);

      resetTranscript();

      if (timeIndex === 2) {
        stop();
        setGameScore(score => (score += 8));
        setMyMissionStatus(true);
      } else {
        setTimeIndex(timeIndex => timeIndex + 1);
        setGameScore(score => (score += 6));
      }
    } else if (trimmedTranscript.length > 1) {
      resetTranscript();
    }
  }, [
    transcript,
    inGameMode,
    isMissionStarting,
    myVideoRef,
    timeIndex,
    resetTranscript,
    stop,
    setGameScore,
    setMyMissionStatus,
  ]);

  return (
    <>
      <MissionStarting />
      {isMissionEnding && <MissionEnding />}
      {isMissionStarting || (
        <>
          <Wrapper>
            <FormulaWrapper>
              <Formula>{round[timeIndex].question} = ?</Formula>
            </FormulaWrapper>
            {isCorrect && (
              <RoundPassStatus $isCorrect={isCorrect}>
                <Icon icon="smile" iconStyle={CORRECT_ICON_STYLE} /> 정답!
              </RoundPassStatus>
            )}
            {/* {!isCorrect && isRoundPassed && (
              <RoundPassStatus $isCorrect={isCorrect}>
                <Icon icon="frown" iconStyle={WRONG_ICON_STYLE} />
                오답!
              </RoundPassStatus>
            )} */}
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

  font: 700 30px 'Jua';

  color: ${({ theme }) => theme.colors.system.white};
  -webkit-text-stroke: ${({ theme, $isCorrect }) =>
      $isCorrect ? theme.colors.primary.emerald : theme.colors.system.red}
    4px;
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
