import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext, OpenViduContext } from '../../../../contexts';
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
  const { inGameMode } = useContext(GameContext);
  const { micOn, turnMicOnOff, myVideoRef, myStream } =
    useContext(OpenViduContext);

  const goToMain = () => {
    navigate('/main');
    // localStorage.removeItem('inGameMode');
    if (myVideoRef.current) {
      if (myStream instanceof MediaStream) {
        myStream.getTracks().forEach(track => track.stop());
        myVideoRef.current.srcObject = null; // 비디오 요소에서 스트림 연결을 해제합니다.
      }
    }
  };

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

  /* background-color: ${({ theme }) => theme.colors.lighter.light}; */
  ${({ theme }) => theme.gradient.navBar}
`;

const BackBtnStyle = {
  size: 24,
  hoverColor: 'purple',
};

const micOnStyle = {
  size: 24,
  hoverColor: 'purple',
};

const micOffStyle = {
  size: 21,
  hoverColor: 'purple',
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
  /* height: 50px; */
  /* padding: 20px; */
  margin-top: 80px;
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
`;
