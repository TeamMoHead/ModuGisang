import React, { useRef, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MissionStarting, MissionEnding } from '../components';
import { OpenViduContext, GameContext, UserContext } from '../../../contexts';

import useSpeechToText from '../MissionEstimators/useSpeechToText';
import { fireworks } from './fireworks';
import MissionSoundEffects from '../Sound/MissionSoundEffects';

const Affirmation = () => {
  const {
    isMissionStarting,
    isMissionEnding,
    inGameMode,
    myMissionStatus,
    setMyMissionStatus,
  } = useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);
  const user = useContext(UserContext);
  const affirmationText = user.userData.affirmation || '';
  const [highlightedText, setHighlightedText] = useState('');
  const { transcript, listening, stop } = useSpeechToText(8);
  const [affirResult, setAffirResult] = useState(false);
  const newTranscriptRef = useRef('');
  const idx = useRef(0);

  console.log(transcript);
  console.log(listening);

  // 인식된 텍스트와 원본 문구 비교 및 강조
  useEffect(() => {
    if (inGameMode !== 5 || !myVideoRef.current || isMissionStarting) {
      return;
    }

    if (affirResult) {
      console.log('끝');
      return;
    }
    // 비교할 값이 있을 때만 동작
    if (transcript) {
      for (let j = 0; j < transcript.length; j++) {
        if (affirmationText[idx.current] === transcript[j]) {
          idx.current += 1;
          newTranscriptRef.current += transcript[j]; //새로운 배열에 값 추가
        }
      }

      const highlighted = (
        <Highlight>
          <Highlighted>{affirmationText.substring(0, idx.current)}</Highlighted>
          <Unhighlighted>
            {affirmationText.substring(idx.current)}
          </Unhighlighted>
        </Highlight>
      );
      setHighlightedText(highlighted);

      if (newTranscriptRef.current.trim() === affirmationText.trim()) {
        console.log('통과');
        stop(); // 음성 인식 중지
        setAffirResult(true); //  통과 상태로 설정
        setMyMissionStatus(true);
        fireworks();
      }
    } else {
      setHighlightedText(<Highlight>{affirmationText}</Highlight>);
    }
  }, [transcript, affirmationText, affirResult, isMissionStarting]);

  return (
    <>
      <MissionStarting />
      {isMissionEnding && <MissionEnding />}
      {isMissionEnding && <MissionSoundEffects />}
      {isMissionStarting || (
        <>
          <Wrapper>
            <Text>{highlightedText}</Text>
          </Wrapper>
          {affirResult ? <Success>성공!</Success> : null}
        </>
      )}
    </>
  );
};

export default Affirmation;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
`;

const Text = styled.p`
  position: absolute;
  top: 33%;
  left: 50%;
  transform: translate(-50%, -33%);

  ${({ theme }) => theme.flex.center}
  width: 90%;
  height: 50%;
  padding: 15px;

  ${({ theme }) => theme.fonts.IBMlarge}
  color:${({ theme }) => theme.colors.primary.navy};
  font-size: 2rem;
  text-align: center;

  background-color: ${({ theme }) => theme.colors.translucent.white};
  border-radius: ${({ theme }) => theme.radius.medium};
  border: 3px solid ${({ theme }) => theme.colors.primary.purple};
`;

const Highlight = styled.span`
  color: grey;
`;

const Highlighted = styled.b`
  color: ${({ theme }) => theme.colors.primary.emerald};
`;

const Unhighlighted = styled.b`
  color: grey;
`;

const Success = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font: ${({ theme }) => theme.fonts.JuaMedium};
  line-height: 1.2;
  font-size: 50px;
`;
