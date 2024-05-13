import React, { useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { RoundBtn } from '../../../components';

import { GameContext } from '../../../contexts';

const MusicController = () => {
  const { inGameMode, isMusicMuted, setIsMusicMuted } = useContext(GameContext);
  const handleUnmute = () => {
    isMusicMuted ? setIsMusicMuted(false) : setIsMusicMuted(true);
  };

  const btnStyle = {
    size: 48,
    icon: 'unmute',
    iconStyle: {
      size: 24,
      color: 'purple',
      hoverColor: 'white',
    },
  };

  return (
    <>
      {inGameMode === 0 && (
        <BtnWrapper>
          <RoundBtn btnStyle={btnStyle} onClickHandler={handleUnmute} />
        </BtnWrapper>
      )}
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
