import React, { useContext, useRef, useEffect, useState } from 'react';
import { OpenViduContext, GameContext } from '../../../contexts';
import styled from 'styled-components';
import { GameLoading } from '../components';
import { rainEffect, effect } from './effect';
import { calculateDecibels } from './decibelUtils';
import sunImage from '../../../assets/sun.png';
import hillImage from '../../../assets/hill.png';

const Mission4 = () => {
  const { isGameLoading, myMissionStatus, setMyMissionStatus } =
    useContext(GameContext);
  const { myStream } = useContext(OpenViduContext);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [decibels, setDecibels] = useState(0); // 데시벨 상태
  const [shoutingDuration, setShoutingDuration] = useState(0); // 함성이 지속된 시간
  const [sunPositionY, setSunPositionY] = useState(window.innerHeight); // 해의 Y 위치
  const [elapsedTime, setElapsedTime] = useState(0); // 경과 시간 (초 단위)
  const startTimeRef = useRef(null); // 시작 시간 저장
  const [isGameOver, setIsGameOver] = useState(false);
  const timeLimit = 10; // 통과 제한 시간 (초 단위)

  useEffect(() => {
    if (!myStream) {
      console.log('🥲🥲🥲🥲Stream is not ready or available.');
      return;
    }
    const actualStream = myStream.stream.getMediaStream();
    setStream(actualStream);

    return () => {
      stopAudioStream();
    };
  }, [myStream]);

  useEffect(() => {
    startTimeRef.current = Date.now(); // 게임 시작 시 시작 시간 기록

    // 매 초마다 경과 시간을 업데이트
    const intervalId = setInterval(() => {
      const elapsedSeconds = Math.floor(
        (Date.now() - startTimeRef.current) / 1000,
      );
      setElapsedTime(elapsedSeconds);

      // 시간이 제한 시간보다 많으면 실패 플래그 설정
      if (elapsedSeconds > timeLimit) {
        clearInterval(intervalId);
        setIsGameOver(true);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (myMissionStatus && !isGameOver) {
      effect(3);
    }
  }, [myMissionStatus]);

  useEffect(() => {
    if (!stream || isGameLoading || myMissionStatus) return;

    if (elapsedTime > timeLimit && isGameOver) {
      console.log('Challenge failed!');
      rainEffect(canvasRef, 3);
      return;
    }

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 2048;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const intervalId = setInterval(() => {
      const decibels = calculateDecibels(analyser, dataArray, bufferLength);
      setDecibels(decibels); // 데시벨 상태 업데이트

      if (decibels > 50) {
        setShoutingDuration(prevDuration => prevDuration + 0.2);
      }
      // else {
      //   //// 지속하지 않을 경우 초기화
      //   // setShoutingDuration(0)
      // }
      if (shoutingDuration > 5) {
        clearInterval(intervalId);
        setMyMissionStatus(true);
        // firework();
        return;
      }
      setSunPosition();
    }, 200);

    return () => {
      clearInterval(intervalId);
      audioContext.close();
    };
  }, [stream, isGameLoading, shoutingDuration, isGameOver]);

  // 스트림 정지 및 자원 해제 함수
  function stopAudioStream() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }

  // function setSunPosition() {
  //   const maxSunPositionY = 50; // 해가 화면 상단에 위치하는 최소 값
  //   const newSunPositionY = Math.max(
  //     window.innerHeight - shoutingDuration * 120,
  //     maxSunPositionY,
  //   );
  //   setSunPositionY(newSunPositionY);
  // }

  function setSunPosition() {
    const screenHeight = window.innerHeight; // 화면 높이
    const minPercentage = 10; // 해가 화면 상단에 위치하는 최소 퍼센트 값
    const percentage = Math.max(
      ((shoutingDuration * 120) / screenHeight) * 150,
      minPercentage,
    );

    // 퍼센트를 높이로 변환하여 위치 설정
    const newSunPositionY = screenHeight * (1 - percentage / 100);
    setSunPositionY(newSunPositionY);
  }

  return (
    <>
      <GameLoading />
      <FullScreenCanvas>
        <SubCanvas ref={canvasRef} />
        <Hill />
        {!myMissionStatus && isGameOver ? null : (
          <Sun id="sun" style={{ top: `${sunPositionY}px` }} />
        )}
      </FullScreenCanvas>
      {isGameOver || isGameLoading || (
        <CanvasWrapper $myMissionStatus={myMissionStatus}>
          <Canvas />
          <SoundIndicator
            $soundWidth={shoutingDuration.toFixed(3) < 5 ? decibels : 0}
          />
        </CanvasWrapper>
      )}
    </>
  );
};

export default Mission4;

const FullScreenCanvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
`;

//전체바
const CanvasWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 50px;
  top: 100px;

  display: ${({ $myMissionStatus }) => ($myMissionStatus ? 'none' : 'block')};
  border: 3px solid ${({ theme }) => theme.colors.primary.white};
  background-color: ${({ theme }) => theme.colors.translucent.navy};
`;

// 목적바
const Canvas = styled.canvas`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 55%;
  height: 100%;
  border-right: 4px solid ${({ theme }) => theme.colors.system.red};
`;

const SubCanvas = styled.canvas`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

//진행바
const SoundIndicator = styled.div`
  display: ${({ $soundWidth }) => ($soundWidth > 0 ? 'block' : 'none')};
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: ${({ $soundWidth }) => $soundWidth}%; // 데시벨에 따라 너비 조절
  background-color: ${({ theme }) => theme.colors.primary.emerald};
  border: 1px solid ${({ theme }) => theme.colors.primary.light};
  transition: width 0.2s ease; // 너비 변화를 0.5초 동안 부드럽게 애니메이션
`;

const Sun = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  background-image: url(${sunImage});
  background-size: cover;
  background-position: center;
  transition: top 0.5s ease;
  z-index: 5; /* FullScreenCanvas보다 앞에 위치 */
`;
const Hill = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 200px;
  background-image: url(${hillImage});
  background-size: cover;
  background-position: center;
  z-index: 10;
`;
