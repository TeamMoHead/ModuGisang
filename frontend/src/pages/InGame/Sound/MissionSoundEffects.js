import React, { useContext, useEffect, useRef } from 'react';
import { GameContext, AccountContext } from '../../../contexts';
import successSound from '../../../assets/soundEffects/missionSuccess.mp3';
import failSound from '../../../assets/soundEffects/missionFailure.mp3';
import thunderSound from '../../../assets/soundEffects/thunderstorm.mp3';
import matesSuccessSound from '../../../assets/soundEffects/matesSuccess.mp3';

const MissionSoundEffects = () => {
  const {
    myMissionStatus,
    isMusicMuted,
    isMissionEnding,
    inGameMode,
    matesMissionStatus,
  } = useContext(GameContext);

  const { userId } = useContext(AccountContext);

  const successAudioRef = useRef(null);
  const failAudioRef = useRef(null);
  const thunderAudioRef = useRef(null);
  const matesAudioRef = useRef(null);

  const playSound = (audioRef, stopAfter = null) => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(error => {
        console.error('Failed to play sound:', error);
      });

      if (stopAfter !== null) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }, stopAfter);
      }
    }
  };

  useEffect(() => {
    if (successAudioRef.current) successAudioRef.current.load();
    if (failAudioRef.current) failAudioRef.current.load();
    if (thunderAudioRef.current) thunderAudioRef.current.load();
    if (matesAudioRef.current) matesAudioRef.current.load();
  }, []);

  useEffect(() => {
    if (isMusicMuted) {
      return;
    }

    if (isMissionEnding) {
      if (myMissionStatus === true) {
        console.log('====== Mission Success effect ======');
        playSound(successAudioRef);
      } else if (myMissionStatus === false) {
        console.log('====== Mission Fail effect ======');
        playSound(failAudioRef);
        if (inGameMode === 4) {
          console.log('======== THUNDERSTORM SOUND EFFECT! ========');
          playSound(thunderAudioRef, 3000);
        }
      }
    }
  }, [myMissionStatus, isMissionEnding, isMusicMuted]);

  useEffect(() => {
    if (isMusicMuted) return;
    Object.entries(matesMissionStatus).forEach(([id, status]) => {
      if (id !== userId.toString() && status.missionCompleted) {
        console.log('====== Mates Mission Success effect ======');
        playSound(matesAudioRef);
      }
    });
  }, [matesMissionStatus, isMusicMuted, userId]);

  return (
    <>
      <audio ref={successAudioRef} src={successSound} preload="auto" />
      <audio ref={failAudioRef} src={failSound} preload="auto" />
      <audio ref={thunderAudioRef} src={thunderSound} preload="auto" />
      <audio ref={matesAudioRef} src={matesSuccessSound} preload="auto" />
    </>
  );
};

export default MissionSoundEffects;
