import React, { useContext, useEffect, useRef } from 'react';

import waitingMusic from '../../../assets/bgm/waiting_room.mp3';
import missionMusic from '../../../assets/bgm/hawaii_cut.mp3';
import resultMusic from '../../../assets/bgm/result_music.mp3';

import { GameContext } from '../../../contexts';

import styled from 'styled-components';

const AUDIO_SOURCE_PATH = {
  waiting: waitingMusic,
  mission: missionMusic,
  result: resultMusic,
};

const getMusicSrc = gameMode => {
  if (gameMode === 0) {
    return AUDIO_SOURCE_PATH.waiting;
  } else if (gameMode === 6) {
    return AUDIO_SOURCE_PATH.result;
  } else {
    return AUDIO_SOURCE_PATH.mission;
  }
};

const DEFAULT_VOLUME = 0.2;

const fadeAudio = (audio, type, duration = 3000) => {
  const maxVolume = DEFAULT_VOLUME;
  const interval = 50;
  const step = maxVolume / (duration / interval);
  let currentVolume = type === 'in' ? 0 : audio.volume;

  const fade = setInterval(() => {
    if (type === 'in') {
      currentVolume = Math.min(currentVolume + step, maxVolume);
      audio.volume = currentVolume;
      if (currentVolume >= maxVolume) {
        clearInterval(fade);
        audio.volume = maxVolume;
      }
    } else if (type === 'out') {
      currentVolume = Math.max(currentVolume - step, 0);
      audio.volume = currentVolume;
      if (currentVolume <= 0) {
        clearInterval(fade);
        audio.pause();
        audio.volume = maxVolume;
      }
    }
  }, interval);
};

const BackgroundMusic = () => {
  const { isMusicMuted, inGameMode } = useContext(GameContext);
  const audioRef = useRef(null);

  useEffect(() => {
    const MISSION_MODE = [1, 2, 3, 4, 5];
    const newSrc = getMusicSrc(inGameMode);

    if (audioRef.current) {
      audioRef.current.volume = DEFAULT_VOLUME;
    }

    if (isMusicMuted) {
      audioRef.current.pause();
      return;
    } else if (inGameMode === 0 || inGameMode === 6) {
      audioRef.current.src = newSrc;
      audioRef.current.play();
    } else if (inGameMode === 1) {
      audioRef.current.src = newSrc;
      audioRef.current.play();
    }
  }, [inGameMode, isMusicMuted]);

  console.log('=========isMusicMuted:: ', isMusicMuted, audioRef);
  return (
    <>
      <audio ref={audioRef} loop autoPlay playsInline />
    </>
  );
};

export default BackgroundMusic;

const BtnWrapper = styled.div`
  position: fixed;
  top: 125px;
  right: 40px;
  z-index: 100;
`;
