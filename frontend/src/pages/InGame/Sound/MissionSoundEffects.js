import React, { useContext, useEffect, useRef } from 'react';
import { GameContext } from '../../../contexts';
import successSound from '../../../assets/soundEffects/missionSuccess.mp3';
import failSound from '../../../assets/soundEffects/missionFailure.mp3';

const MissionSoundEffects = () => {
  const { myMissionStatus, isMusicMuted, isMissionEnding } =
    useContext(GameContext);
  const successAudioRef = useRef(null);
  const failAudioRef = useRef(null);

  useEffect(() => {
    successAudioRef.current.load();
    failAudioRef.current.load();
  }, []);

  useEffect(() => {
    if (isMusicMuted) {
      return;
    }

    const playSound = audioRef => {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(error => {
        console.error('Failed to play sound:', error);
      });
    };

    if (isMissionEnding) {
      if (myMissionStatus === true) {
        console.log('====== Mission Success effect ======');
        playSound(successAudioRef);
      } else if (myMissionStatus === false) {
        console.log('====== Mission Fail effect ======');
        playSound(failAudioRef);
      }
    }
  }, [myMissionStatus, isMissionEnding, isMusicMuted]);

  return (
    <>
      <audio ref={successAudioRef} src={successSound} preload="auto" />
      <audio ref={failAudioRef} src={failSound} preload="auto" />
    </>
  );
};

export default MissionSoundEffects;
