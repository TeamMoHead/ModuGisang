import React, { useContext, useEffect, useRef } from 'react';

import waitingMusic from '../../../assets/bgm/waiting_room.mp3';
import missionMusic from '../../../assets/bgm/hawaii_cut.mp3';
import resultMusic from '../../../assets/bgm/result_music.mp3';

import { GameContext } from '../../../contexts';
import { RoundBtn } from '../../../components';

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

const defaultVolume = 0.2;

const fadeAudio = (audio, type, duration = 3000) => {
  const maxVolume = defaultVolume;
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

const BackgroundMusic = ({ gameMode, playing }) => {
  const { isMusicMuted } = useContext(GameContext);
  const audioRef = useRef(null);
  const currentGameMode = useRef(gameMode);

  useEffect(() => {
    const missionMode = [1, 2, 3, 4, 5];
    const newSrc = getMusicSrc(gameMode);

    if (audioRef.current) {
      audioRef.current.volume = defaultVolume;
    }

    if (
      missionMode.includes(gameMode) &&
      missionMode.includes(currentGameMode.current)
    ) {
    } else {
      if (audioRef.current.src !== newSrc) {
        fadeAudio(audioRef.current, 'out', 1000);
        setTimeout(() => {
          audioRef.current.src = newSrc;
          audioRef.current.load();
          audioRef.current.volume = defaultVolume;
          // fadeAudio(audioRef.current, 'in', 2000);
        }, 1000);
      }
      currentGameMode.current = gameMode;
    }

    const playAudio = async () => {
      if (audioRef.current) {
        try {
          if (playing && audioRef.current.paused) {
            audioRef.current.volume = defaultVolume;
            if (gameMode !== 6 && currentGameMode.current !== 6) {
              fadeAudio(audioRef.current, 'in', 2000);
            } else if (!playing) {
              fadeAudio(audioRef.current, 'out', 2000);
            }
          }
        } catch (err) {
          console.error('오디오 재생 실패:', err);
        }
      }
    };

    playAudio();
  }, [gameMode, playing]);

  return (
    <>
      <audio ref={audioRef} loop autoPlay muted={isMusicMuted} />
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
