import React, { useRef, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MissionStarting, MissionEnding } from '../components';
import { OpenViduContext, GameContext, UserContext } from '../../../contexts';

import useSpeechToText from '../MissionEstimators/useSpeechToText';
import MissionSoundEffects from '../Sound/MissionSoundEffects';
import { Icon } from '../../../components';

const Mission5 = () => {
  const {
    isMissionStarting,
    isMissionEnding,
    inGameMode,
    isRoundPassed,
    setIsRoundPassed,

    setMyMissionStatus,
    setGameScore,
  } = useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);
  const { transcript, stop, resetTranscript } = useSpeechToText(20);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeIndex, setTimeIndex] = useState(0);

  useEffect(() => {
    if (inGameMode !== 5 || !myVideoRef.current || isMissionStarting) {
      return;
    }

    const trimmedTranscript = transcript.trim();
    console.log('====MISSION5 ====> ', trimmedTranscript);

    if (trimmedTranscript === timesTable[timeIndex].answer) {
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
              <Formula>{timesTable[timeIndex].question} = ?</Formula>
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

const timesTable = {
  0: { question: '5 X 4', answer: '20' },
  1: { question: '4 X 4', answer: '16' },
  2: { question: '8 X 5', answer: '40' },
};

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
