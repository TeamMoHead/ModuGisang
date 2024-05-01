import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../../../../contexts/GameContext';
import { Icon } from '../../../../components';
import { GameRound, MissionTitle, MissionInfo, Timer } from './';
import styled from 'styled-components';

const GAME_MODE = {
  0: 'waiting',
  1: 'mission1',
  2: 'mission2',
  3: 'mission3',
  4: 'mission4',
  5: 'affirmation',
  6: 'result',
};

const InGameNav = () => {
  const navigate = useNavigate();
  const { inGameMode, micOn, turnMicOnOff } = useContext(GameContext);

  const goToMain = () => {
    navigate('/main');
  };

  useEffect(() => {}, [inGameMode]);

  return (
    <Wrapper>
      <BtnArea
        $hasLeftBtn={
          GAME_MODE[inGameMode] === 'waiting' ||
          GAME_MODE[inGameMode] === 'result'
        }
      >
        {(GAME_MODE[inGameMode] === 'waiting' ||
          GAME_MODE[inGameMode] === 'result') && (
          <Icon
            icon="back"
            iconStyle={BackBtnStyle}
            onClickHandler={goToMain}
          />
        )}
        <Icon
          icon={micOn ? 'micOn' : 'micOff'}
          iconStyle={micOn ? micOnStyle : micOffStyle}
          onClickHandler={turnMicOnOff}
        />
      </BtnArea>
      <TextArea>
        {GAME_MODE[inGameMode] !== 'waiting' && (
          <>
            <GameRound />
            <MissionTitle />
            <MissionInfo />
          </>
        )}
        {GAME_MODE[inGameMode] === 'waiting' && <Timer />}
      </TextArea>
    </Wrapper>
  );
};

export default InGameNav;

const Wrapper = styled.nav`
  z-index: 100;
  position: fixed;
  top: 0;
  ${({ theme }) => theme.flex.between}
  align-items: center;
  width: 100vw;
  height: 100px;

  background-color: ${({ theme }) => theme.colors.lighter.light};
`;

const BackBtnStyle = {
  size: 24,
  color: 'purple',
};

const micOnStyle = {
  size: 24,
  color: 'purple',
};

const micOffStyle = {
  size: 21,
  color: 'purple',
};

const BtnArea = styled.div`
  position: fixed;
  top: 0;

  width: 100vw;
  height: 50px;
  padding: 0 20px;
  ${({ theme, $hasLeftBtn }) =>
    $hasLeftBtn ? theme.flex.between : theme.flex.right}
`;

const TextArea = styled.div`
  width: 100vw;
  height: 50px;
  padding: 20px;
  margin-top: -50px;
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
`;
