import React, { useContext, useRef, useEffect, useState } from 'react';
import { OpenViduContext, GameContext } from '../../../contexts';
import { GameLoading } from '../components';

import styled from 'styled-components';
import confetti from 'canvas-confetti';

const Mission4 = () => {
  const { isGameLoading, myMissionStatus, setMyMissionStatus } =
    useContext(GameContext);
  const { myStream } = useContext(OpenViduContext);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [decibels, setDecibels] = useState(0); // 데시벨 상태
  const [shoutingDuration, setShoutingDuration] = useState(0); // 함성이 지속된 시간
  // const [showFailEffect, setShowFailEffect] = useState(false);

  useEffect(() => {
    if (!myStream) {
      console.log('🥲🥲🥲🥲Stream is not ready or available.');
      return;
    }

    const actualStream = myStream.stream.getMediaStream();
    setStream(actualStream);
    console.log('Audio Stream: ', actualStream);

    return () => {
      stopAudioStream();
    };
  }, [myStream]);

  useEffect(() => {
    if (!stream || isGameLoading) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 2048;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const id = setInterval(() => {
      analyser.getByteTimeDomainData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const value = (dataArray[i] - 128) / 128;
        sum += value * value;
      }

      const rms = Math.sqrt(sum / bufferLength);
      const newDecibels = 40 * Math.log10(rms) + 100;
      setDecibels(newDecibels); // 데시벨 상태 업데이트
      console.log(`Decibels: ${newDecibels.toFixed(2)} dB`);

      if (newDecibels > 50) {
        //   console.log('Challenge passed!');
        //   clearInterval(id);
        //   audioContext.close();
        setShoutingDuration(prevDuration => prevDuration + 0.2);
      } else {
        // setShoutingDuration(0)
      }
      if (shoutingDuration > 5) {
        console.log('Challenge passed!');
        clearInterval(id);
        // audioContext.close();
        setMyMissionStatus(true);
      }

      console.log('=======Shouting Duration: ', shoutingDuration);
    }, 200);

    return () => {
      clearInterval(id);
      audioContext.close();
    };
  }, [stream, isGameLoading, shoutingDuration]);

  // 스트림 정지 및 자원 해제 함수
  function stopAudioStream() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }
  // // 실패시 비 효과 적용
  // useEffect(() => {
  //   if (showFailEffect) {
  //     rainEffect(canvasRef);
  //   }
  // }, [showFailEffect]);

  // Canvas에 데시벨 그리기//
  useEffect(() => {
    if (shoutingDuration <= 5) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [decibels]);

  console.log('=========MY MISSION STATUS: ', myMissionStatus);

  return (
    <>
      <GameLoading />

      <FullScreenCanvas ref={canvasRef} />
      {/* { myMissionStatus ? triggerEffect(canvasRef) : `데시벨 도달 확인: ${decibels.toFixed(2)} dB`}{' '} */}
      {myMissionStatus ? triggerEffect(canvasRef) : null}
      {isGameLoading || (
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

const triggerEffect = canvasRef => {
  effect();
  //rainEffect(canvasRef);
};

const effect = () => {
  var end = Date.now() + 3 * 1000;

  // go Buckeyes!
  var colors = ['#F0F3FF', '#15F5BA'];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

const FullScreenCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  position: relative;
`;

//전체바
const CanvasWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 50px;
  top: 100px;

  display: ${({ $myMissionStatus }) => ($myMissionStatus ? 'none' : 'block')};
  border: 3px solid ${({ theme }) => theme.colors.primary.light};
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
  height: 100%;
  width: ${({ $soundWidth }) => $soundWidth}%; // 데시벨에 따라 너비 조절
  background-color: ${({ theme }) => theme.colors.primary.emerald};
  border: 1px solid ${({ theme }) => theme.colors.primary.light};
  transition: width 0.2s ease; // 너비 변화를 0.5초 동안 부드럽게 애니메이션
`;

const rainEffect = canvasRef => {
  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');
  const drops = [];

  class Drop {
    constructor(x, y, speed, length) {
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.length = length;
      this.draw();
    }

    draw() {
      context.beginPath();
      context.strokeStyle = 'rgba(175, 238, 253, 0.7)';
      context.moveTo(this.x, this.y);
      context.lineTo(this.x, this.y + this.length);
      context.stroke();
      context.closePath();
    }
  }

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drops.forEach(drop => {
      drop.y += drop.speed;
      if (drop.y > canvas.height) {
        drop.y = 0;
        drop.x = Math.random() * canvas.width;
        drop.speed = Math.random() * 3 + 1;
        drop.length = Math.random() * 5 + 2;
      }
      drop.draw();
    });

    requestAnimationFrame(render);
  }

  let tempX, tempY, tempSpeed, tempLength;
  for (let i = 0; i < 200; i++) {
    tempX = Math.random() * canvas.width;
    tempY = Math.random() * canvas.height;
    tempSpeed = Math.random() * 3 + 1;
    tempLength = Math.random() * 5 + 2;

    drops.push(new Drop(tempX, tempY, tempSpeed, tempLength));
  }

  render();
};
