import React, { useContext, useRef, useEffect, useState } from 'react';
import { OpenViduContext, GameContext } from '../../../contexts';
import styled from 'styled-components';
import { MissionStarting, MissionEnding } from '../components';
import { calculateDecibels } from './decibelUtils';
import sunImage from '../../../assets/sun.png';
import hillImage from '../../../assets/hill.png';

const Mission4 = () => {
  const {
    isMissionStarting,
    isMissionEnding,
    isMusicMuted,
    myMissionStatus,
    gameScore,
    setGameScore,
    setIsRoundPassed,
    setMyMissionStatus,
  } = useContext(GameContext);
  const { myStream, setMicOn } = useContext(OpenViduContext);

  const [stream, setStream] = useState(null);
  const [decibels, setDecibels] = useState(0); // 데시벨 상태
  const [shoutingDuration, setShoutingDuration] = useState(0); // 함성이 지속된 시간

  const [sunPositionY, setSunPositionY] = useState(window.innerHeight); // 해의 Y 위치
  const canvasRef = useRef(null); // 캔버스 참조

  const [elapsedTime, setElapsedTime] = useState(0); // 경과 시간 (초 단위)
  const startTimeRef = useRef(null); // 시작 시간 저장
  const [isGameOver, setIsGameOver] = useState(false);
  const TIME_LIMIT = 13; // 통과 제한 시간 (초 단위)
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (!myStream) {
      return;
    }
    //const actualStream = myStream.stream.getMediaStream();
    initializeStream();

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
      if (elapsedSeconds > TIME_LIMIT) {
        clearInterval(intervalId);
        setIsGameOver(true);
        micSetting(true);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (myMissionStatus && !isGameOver) {
      // effect(3);
      setRemainingTime(TIME_LIMIT - elapsedTime);
    }
  }, [myMissionStatus]);

  useEffect(() => {
    updateGameScore(remainingTime);
  }, [remainingTime]);

  useEffect(() => {
    if (!stream || isMissionStarting || myMissionStatus) return;

    if (elapsedTime > TIME_LIMIT && isGameOver) {
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
      if (shoutingDuration > 5) {
        clearInterval(intervalId);
        setMyMissionStatus(true);
        setIsRoundPassed(true);
        micSetting(true);

        return;
      }
      setSunPosition();
    }, 200);

    return () => {
      clearInterval(intervalId);
      audioContext.close();
    };
  }, [stream, isMissionStarting, shoutingDuration, isGameOver]);

  // 스트림 정지 및 자원 해제 함수
  function stopAudioStream() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }
  function micSetting(state) {
    myStream.publishAudio(state);
    setMicOn(state);
  }

  function updateGameScore(remainingTime) {
    let scoreToAdd = 0;
    if (remainingTime >= 5) scoreToAdd = 20;
    else if (remainingTime >= 4) scoreToAdd = 16;
    else if (remainingTime >= 3) scoreToAdd = 12;
    else if (remainingTime >= 2) scoreToAdd = 8;
    else if (remainingTime >= 1) scoreToAdd = 4;

    setGameScore(prevScore => prevScore + scoreToAdd);
  }

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

  async function getAudioStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      return stream;
    } catch (error) {
      console.error('Error accessing audio stream', error);
    }
  }

  async function initializeStream() {
    const audioStream = await getAudioStream();
    if (audioStream) {
      setStream(audioStream);
      micSetting(false);
    }
  }
  return (
    <>
      <MissionStarting />
      {isMissionEnding && <MissionEnding canvasRef={canvasRef} />}
      <FullScreenCanvas>
        <SubCanvas ref={canvasRef} />
        <Hill />
        {!myMissionStatus && isGameOver ? null : (
          <Sun id="sun" style={{ top: `${sunPositionY}px` }} />
        )}
      </FullScreenCanvas>
      {isGameOver || isMissionStarting || (
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
  z-index: 200;

  position: absolute;

  width: 100%;
  height: 100%;

  ${({ theme }) => theme.flex.center}

  overflow: hidden;
`;

//전체바
const CanvasWrapper = styled.div`
  z-index: 300;

  position: absolute;
  top: 25px;

  width: 80%;
  height: 30px;

  display: ${({ $myMissionStatus }) => ($myMissionStatus ? 'none' : 'block')};

  border-radius: ${({ theme }) => theme.radius.small};
  border: 2px solid ${({ theme }) => theme.colors.primary.white};
  background-color: ${({ theme }) => theme.colors.translucent.navy};
`;

// 목적바
const Canvas = styled.canvas`
  position: absolute;
  bottom: 0;
  left: 0;

  width: 70%;
  height: 100%;

  border-right: 4px solid ${({ theme }) => theme.colors.system.red};
`;

//진행바
const SoundIndicator = styled.div`
  display: ${({ $soundWidth }) => ($soundWidth > 0 ? 'block' : 'none')};
  position: absolute;
  bottom: 0;
  left: 0;

  width: ${({ $soundWidth }) => $soundWidth}%;
  height: 100%;

  border-radius: ${({ theme }) => theme.radius.small};
  border: 1px solid ${({ theme }) => theme.colors.primary.white};
  background-color: ${({ theme }) => theme.colors.primary.emerald};

  transition: width 0.2s ease; // 너비 변화를 0.5초 동안 부드럽게 애니메이션
`;

const SubCanvas = styled.canvas`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Sun = styled.div`
  position: absolute;

  padding-top: 300px;
  width: 300px;
  height: 300px;

  background-image: url(${sunImage});
  background-size: cover;
  background-position: center;

  transition: top 0.5s ease;
`;

const Hill = styled.div`
  z-index: 300;
  position: absolute;
  bottom: 0;
  left: 0;

  width: 100%;
  height: 200px;

  border-radius: ${({ theme }) => theme.radius.medium};

  background-image: url(${hillImage});
  background-size: cover;
  background-position: center;
`;
