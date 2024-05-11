import React, { useContext, useEffect, useRef } from 'react';
import { GameContext } from '../../contexts';
import successSound from '../../assets/soundEffects/missionSuccess.mp3';
import failSound from '../../assets/soundEffects/missionFailure.mp3';

const GameSoundEffects = () => {
  const successAudioRef = useRef(new Audio(successSound));
  const failAudioRef = useRef(new Audio(failSound));
  const { myMissionStatus, inGameMode } = useContext(GameContext);

  useEffect(() => {
    if (inGameMode === 0) {
      return;
    }
    if (myMissionStatus === true) {
      successAudioRef.current.volume = 0.5;
      successAudioRef.current.play();
    } else if (myMissionStatus === false) {
      failAudioRef.current.volume = 0.5;
      failAudioRef.current.play();
    }
  }, [myMissionStatus]);

  return null; // UI를 렌더링하지 않는 컴포넌트
};

export default GameSoundEffects;
