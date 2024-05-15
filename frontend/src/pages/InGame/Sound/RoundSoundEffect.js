import React, { useContext, useEffect, useRef } from 'react';
import { GameContext } from '../../../contexts';

import roundSound from '../../../assets/soundEffects/roundSuccess.mp3';
import paperSound from '../../../assets/soundEffects/paperbye.mp3';

const RoundSoundEffect = () => {
  const { isMusicMuted, isRoundPassed, inGameMode } = useContext(GameContext);

  const roundAudioRef = useRef(null);
  const paperAudioRef = useRef(null);

  useEffect(() => {
    if (roundAudioRef.current) roundAudioRef.current.load();
    if (paperAudioRef.current) paperAudioRef.current.load();
  }, []);

  useEffect(() => {
    if (isMusicMuted) {
      return;
    }

    const playSound = (audioRef, stopAfter = null) => {
      if (audioRef.current) {
        if (audioRef === paperAudioRef) audioRef.current.volume = 0.3;
        else audioRef.current.volume = 0.6;

        audioRef.current.play().catch(error => {
          console.error('Failed to play sound:', error);
        });

        if (stopAfter !== null) {
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0; // Reset audio to start
            }
          }, stopAfter);
        }
      }
    };

    if (isRoundPassed === true && !isMusicMuted && inGameMode === 2) {
      console.log('====== Round Success effect ======');
      playSound(paperAudioRef);
    } else if (isRoundPassed === true && !isMusicMuted) {
      console.log('====== Round Success effect ======');
      playSound(roundAudioRef);
    }
  }, [isRoundPassed, inGameMode]);

  return (
    <>
      <audio ref={roundAudioRef} src={roundSound} preload="auto" />
      <audio ref={paperAudioRef} src={paperSound} preload="auto" />
    </>
  );
};

export default RoundSoundEffect;
