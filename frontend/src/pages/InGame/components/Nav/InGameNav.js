import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../../../../contexts/GameContext';
import { Icon } from '../../../../components';
import { GameRound, MissionTitle, MissionInfo, Timer } from './';
import styled from 'styled-components';

const InGameNav = () => {
  const navigate = useNavigate();
  const { inGameMode, missionNum, micOn, turnMicOnOff } =
    useContext(GameContext);

  const goBack = () => {
    navigate('/main');
  };

  useEffect(() => {}, [inGameMode]);

  return (
    <Wrapper>
      {(inGameMode === 'waiting' || inGameMode === 'result') && (
        <LeftArea>
          <Icon icon="back" iconStyle={BackBtnStyle} onClickHandler={goBack} />
        </LeftArea>
      )}
      <RightArea>
        <Icon
          icon={micOn ? 'micOn' : 'micOff'}
          iconStyle={micOn ? micOnStyle : micOffStyle}
          onClickHandler={turnMicOnOff}
        />
      </RightArea>
      <TextArea>
        {inGameMode !== 'waiting' && (
          <>
            <GameRound />
            <MissionTitle />
            <MissionInfo />
          </>
        )}
        {inGameMode === 'waiting' && <Timer />}
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
  background-color: rgb(255, 255, 255, 0.4);
`;

const BackBtnStyle = {
  size: 24,
  color: 'main',
};

const micOnStyle = {
  size: 24,
  color: 'main',
};

const micOffStyle = {
  size: 21,
  color: 'main',
};

const LeftArea = styled.div`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 50px;
  padding: 0 20px;
  ${({ theme }) => theme.flex.left}
`;

const RightArea = styled.div`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 50px;
  padding: 0 20px;
  ${({ theme }) => theme.flex.right}
`;

const TextArea = styled.div`
  width: 100vw;
  height: 50px;
  padding: 20px;
  margin-top: -50px;
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
`;
