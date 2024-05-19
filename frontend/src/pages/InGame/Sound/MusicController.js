import React, { useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { RoundBtn } from '../../../components';
import {
  BackgroundMusic,
  MissionSoundEffects,
  RoundSoundEffect,
  FailedSoundEffect,
} from '../Sound';

import { GameContext } from '../../../contexts';

const MusicController = () => {
  const { inGameMode, isMusicMuted, setIsMusicMuted } = useContext(GameContext);
  const handleUnmute = () => {
    isMusicMuted ? setIsMusicMuted(false) : setIsMusicMuted(true);
  };

  const MUSIC_ON_BTN_STYLE = {
    size: 48,
    icon: 'musicOn',
    iconStyle: {
      size: 24,
      color: 'white',
      hoverColor: 'white',
    },
  };

  const MUSIC_OFF_BTN_STYLE = {
    size: 48,
    disabled: false,
    icon: 'musicOff',
    iconStyle: {
      size: 38,
      color: 'grey',
      hoverColor: 'grey',
    },
  };

  return (
    <>
      {inGameMode === 0 && (
        <BtnWrapper>
          <RoundBtn
            btnStyle={isMusicMuted ? MUSIC_OFF_BTN_STYLE : MUSIC_ON_BTN_STYLE}
            onClickHandler={handleUnmute}
          />
        </BtnWrapper>
      )}
      <BackgroundMusic />
      <MissionSoundEffects />
      <RoundSoundEffect />
      <FailedSoundEffect />
    </>
  );
};

export default MusicController;

const BtnWrapper = styled.div`
  position: fixed;
  top: 125px;
  right: 40px;
  z-index: 100;
`;
