import React, { useContext, useEffect, useRef } from 'react';
import { GameContext } from '../../../contexts';
import successSound from '../../../assets/soundEffects/missionSuccess.mp3';
import failSound from '../../../assets/soundEffects/missionFailure.mp3';

const GameSoundEffects = () => {
  const successAudioRef = useRef(new Audio(successSound));
  const failAudioRef = useRef(new Audio(failSound));
  const { myMissionStatus, inGameMode } = useContext(GameContext);
  const previousMissionStatus = useRef(null); // 이전 미션 상태를 저장하기 위한 ref

  useEffect(() => {
    previousMissionStatus.current = myMissionStatus; // 컴포넌트가 업데이트될 때마다 현재 상태를 이전 상태로 저장
  });

  useEffect(() => {
    if (inGameMode === 0) {
      return;
    }
    if (myMissionStatus === true) {
      successAudioRef.current.volume = 0.5;
      successAudioRef.current.play();
    } else if (
      myMissionStatus === false &&
      previousMissionStatus.current === true
    ) {
      // 이전 상태가 true이고 현재 상태가 false로 변한 경우에만 실패음 재생
      failAudioRef.current.volume = 0.5;
      failAudioRef.current.play();
    }
  }, [myMissionStatus, inGameMode]);

  return null;
};

export default GameSoundEffects;
