import React, { useContext, useEffect, useRef } from 'react';
import { GameContext } from '../../../contexts';

import failedSound from '../../../assets/soundEffects/missionFailure.mp3';

const FailedSoundEffect = () => {
  const { isMusicMuted, isRoundFailed, inGameMode } = useContext(GameContext);

  const roundAudioRef = useRef(null);

  useEffect(() => {
    if (roundAudioRef.current) roundAudioRef.current.load();
  }, []);

  useEffect(() => {
    if (isMusicMuted) {
      return;
    }

    const playSound = (audioRef, stopAfter = null) => {
      if (audioRef.current) {
        audioRef.current.volume = 0.6;

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

    if (isRoundFailed === true && !isMusicMuted) {
      playSound(roundAudioRef);
    }
  }, [isRoundFailed, inGameMode]);

  return (
    <>
      <audio ref={roundAudioRef} src={failedSound} preload="auto" />
    </>
  );
};

export default FailedSoundEffect;
