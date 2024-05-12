import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext, OpenViduContext } from '../../../../contexts';
import { RoundBtn } from '../../../../components';
import { GameRound, MissionTitle, MissionInst, Timer } from './';
import { INFO_BY_GAME_MODE } from './DATA';
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

  useEffect(() => {
    if (turnMicOnOff) {
      if (inGameMode === 4 || inGameMode === 5) {
        // ----------⭐️ 고려 사항 ⭐️-------------
        // Mission4(전방에 함성 발사)에서 마이크 끄려고 했는데,
        // openvidu와 연결되어 있어서, 끄면 안 됨.
        // 상대방에게 들리지 않지만, 측정은 가능하게 하려면,
        // Mission4에 쓰는 오디오 따로 따와야 함
        // -----------------------------------
        //
        // if (micOn) turnMicOnOff(false);
      }
      if (inGameMode === 6) {
        if (!micOn) turnMicOnOff(true);
      }
    }
    return () => {};
  }, [inGameMode, turnMicOnOff]);

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
          <RoundBtn btnStyle={BACK_BTN_STYLE} onClickHandler={goToMain} />
        )}
        <RoundBtn
          btnStyle={micOn ? MIC_ON_BTN_STYLE : MIC_OFF_BTN_STYLE}
          onClickHandler={turnMicOnOff}
        />
      </BtnArea>
      <TextArea>
        {GAME_MODE[inGameMode] !== 'waiting' && (
          <>
            {GAME_MODE[inGameMode] !== 'result' && (
              <GameRound text={inGameMode} />
            )}
            <InstructionArea>
              <MissionTitle text={INFO_BY_GAME_MODE[inGameMode].title} />
              <MissionInst text={INFO_BY_GAME_MODE[inGameMode].instruction} />
            </InstructionArea>
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

  background-color: ${({ theme }) => theme.colors.translucent.white};
`;

const BtnArea = styled.div`
  z-index: 150;
  position: fixed;
  width: 100vw;
  height: 50px;
  padding: 0 20px;

  ${({ theme, $hasLeftBtn }) =>
    $hasLeftBtn ? theme.flex.between : theme.flex.right}
`;

const TextArea = styled.div`
  width: 100vw;
  margin: 0 20px;

  ${({ theme }) => theme.flex.center}
  flex-direction: column;
`;

const InstructionArea = styled.div`
  position: absolute;
  margin: 0 auto;
  padding: 0 80px;
  ${({ theme }) => theme.flex.center}
  flex-direction: column;

  ${({ theme }) => theme.fonts.IBMsmall}
  color: ${({ theme }) => theme.colors.primary.navy};
  text-align: center;
`;

const BACK_BTN_STYLE = {
  size: 50,
  disabled: false,
  icon: 'back',
  iconStyle: {
    size: 24,
    color: 'white',
    hoverColor: 'purple',
  },
};

const MIC_ON_BTN_STYLE = {
  size: 50,
  disabled: false,
  icon: 'micOn',
  iconStyle: {
    size: 24,
    color: 'white',
    hoverColor: 'purple',
  },
};

const MIC_OFF_BTN_STYLE = {
  size: 50,
  disabled: false,
  icon: 'micOff',
  iconStyle: {
    size: 24,
    color: 'white',
    hoverColor: 'purple',
  },
};
