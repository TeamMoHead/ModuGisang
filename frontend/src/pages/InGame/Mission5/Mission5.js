import React, { useRef, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MissionStarting, MissionEnding } from '../components';
import { OpenViduContext, GameContext, UserContext } from '../../../contexts';

import useSpeechToText from '../MissionEstimators/useSpeechToText';
import MissionSoundEffects from '../Sound/MissionSoundEffects';

const Mission5 = () => {
  const {
    isGameScoreSent,
    sendMyGameScore,
    isMissionStarting,
    isMissionEnding,
    inGameMode,
    setMyMissionStatus,
    setGameScore,
  } = useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);
  const { transcript, stop, resetTranscript } = useSpeechToText(20);
  const [successText, setSuccessText] = useState('');
  const [timeIndex, setTimeIndex] = useState(0);

  useEffect(() => {
    if (inGameMode === 5) {
      if (isGameScoreSent) return;
      sendMyGameScore();
    } else return;
  }, [isGameScoreSent]);

  useEffect(() => {
    if (inGameMode !== 5 || !myVideoRef.current || isMissionStarting) {
      return;
    }

    if (transcript === timesTable[timeIndex].answer) {
      console.log('성공~!');
      resetTranscript();
      const result = <Success>성공~!</Success>;
      setSuccessText(result);
      if (timeIndex === 4) {
        stop();
        setGameScore(score => (score += 4));
        setMyMissionStatus(true);
      } else {
        setTimeIndex(timeIndex => timeIndex + 1);
        setGameScore(score => (score += 4));
      }
    } else if (transcript.length > 1) {
      resetTranscript();
    }
  });

  return (
    <>
      <MissionStarting />
      {isMissionEnding && <MissionEnding />}
      {isMissionStarting || (
        <>
          <Wrapper>
            <Formula>{timesTable[timeIndex].question}</Formula>
            {successText}
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

const Formula = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  font: ${({ theme }) => theme.fonts.title};
  line-height: 1.2;
  font-size: 50px;
`;

const Success = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font: ${({ theme }) => theme.fonts.title};
  line-height: 1.2;
  font-size: 50px;
`;

const timesTable = {
  0: { question: '3 X 9', answer: '27' },
  1: { question: '7 X 6', answer: '42' },
  2: { question: '6 X 4', answer: '24' },
  3: { question: '4 X 9', answer: '36' },
  4: { question: '5 X 8', answer: '40' },
};
