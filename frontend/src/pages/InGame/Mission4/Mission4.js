import React, { useContext, useRef, useEffect, useState } from 'react';
import { OpenViduContext, GameContext } from '../../../contexts';
import styled, { keyframes } from 'styled-components';
import confetti from 'canvas-confetti';

const Mission4 = () => {
  const { myMissionStatus, setMyMissionStatus } = useContext(GameContext);
  const { myStream } = useContext(OpenViduContext);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [decibels, setDecibels] = useState(0); // 데시벨 상태
  const [shoutingDuration, setShoutingDuration] = useState(0); // 함성이 지속된 시간
  // const [showFailEffect, setShowFailEffect] = useState(false);
  // const [waterLevel, setWaterLevel] = useState(0); // 물 높이

  useEffect(() => {
    if (!myStream) {
      console.log('Stream is not ready or available.');
      return;
    }

    const actualStream = myStream.stream.getMediaStream();
    setStream(actualStream);

    return () => {
      stopAudioStream();
    };
  }, [myStream]);

  useEffect(() => {
    if (!stream) return;
    // if (shoutingDuration > 5) {
    //   return;
    // }

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
        //   setMyMissionStatus(true);
        setShoutingDuration(prevDuration => prevDuration + 0.2);
      } else {
        // setShoutingDuration(0)
      }
      if (shoutingDuration > 5) {
        console.log('Challenge passed!');
        clearInterval(id);
        // audioContext.close();
        setMyMissionStatus(true);
        // firework();
      }

      // const maxLevel = 70; // 물이 최대 높이까지 차오르는 데시벨 값
      // const minLevel = 0; // 물이 아예 안 차오르는 데시벨 값
      // const level = Math.min(
      //   (newDecibels - minLevel) / (maxLevel - minLevel),
      //   1,
      // );
      // setWaterLevel(level * 100); // 퍼센티지 값으로 설정

      console.log('=======Shouting Duration: ', shoutingDuration);
    }, 200);

    return () => {
      clearInterval(id);
      audioContext.close();
    };
  }, [stream, shoutingDuration]);

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
      // ctx.fillStyle = 'green';
      // const barWidth = Math.max(0, decibels); // 데시벨에 따른 바 너비 계산
      // ctx.fillRect(0, 0, barWidth, canvas.height);
    }
  }, [decibels]);

  // useEffect(() => {
  //   if (canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     const ctx = canvas.getContext('2d');

  //     const drawWater = () => {
  //       // ctx.clearRect(0, 0, canvas.width, canvas.height);
  //       // ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
  //       const waterHeight = canvas.height * (waterLevel / 100);
  //       // ctx.fillRect(0, canvas.height - waterHeight, canvas.width, waterHeight);

  //       // 파도 효과
  //       ctx.fillStyle = 'rgba(0, 150, 255, 0.5)';
  //       ctx.beginPath();
  //       ctx.moveTo(0, canvas.height - waterHeight);
  //       const waveHeight = 3;
  //       const waveFrequency = 10;

  //       for (let i = 0; i < canvas.width; i++) {
  //         ctx.lineTo(
  //           i,
  //           canvas.height -
  //             waterHeight +
  //             Math.sin(i / waveFrequency) * waveHeight,
  //         );
  //       }
  //       ctx.lineTo(canvas.width, canvas.height);
  //       ctx.lineTo(0, canvas.height);
  //       ctx.closePath();
  //       ctx.fill();
  //     };

  //     drawWater();
  //   }
  // }, [waterLevel]);

  console.log('=========MY MISSION STATUS: ', myMissionStatus);

  return (
    <>
      <Wrapper>
        <FullScreenCanvas ref={canvasRef} />
        {/* <FullScreenWave width={window.innerWidth} height={window.innerHeight} /> */}
        <Status $myMissionStatus={myMissionStatus}>
          {/* { myMissionStatus ? triggerEffect(canvasRef) : `데시벨 도달 확인: ${decibels.toFixed(2)} dB`}{' '} */}
          {myMissionStatus ? triggerEffect(canvasRef) : null}
        </Status>

        <CanvasWrapper>
          <Canvas /*ref={canvasRef}*/ />
          <SoundIndicator
            $soundWidth={shoutingDuration.toFixed(3) < 5 ? decibels : 0}
          />
        </CanvasWrapper>
      </Wrapper>
    </>
  );
};

export default Mission4;

// const waveKeyframes1 = keyframes`
//   0% { background-position: 0 0; }
//   100% { background-position: 1600px 0; }
// `;

// const waveKeyframes2 = keyframes`
//   0% { background-position: 0 0; }
//   100% { background-position: -1600px 0; }
// `;

// const WaveLayer1 = styled.div`
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   width: 100%;
//   height: 20%;
//   background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 90 240 300' preserveAspectRatio='none'%3E%3Crect x='0' y='0' width='500' height='800' style='stroke: none; fill: rgb(175,238,238);' /%3E%3Cpath d='M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z' style='stroke: none;'%3E%3C/path%3E%3C/svg%3E")
//     repeat-x;
//   background-size: 1000px 100%;
//   animation: ${waveKeyframes1} 4s linear infinite;
//   opacity: 0.6; // 투명도 추가
// `;

// const WaveLayer2 = styled.div`
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   width: 100%;
//   height: 20%;
//   background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 90 240 300' preserveAspectRatio='none'%3E%3Crect x='0' y='0' width='500' height='800' style='stroke: none; fill: rgb(175,238,238);' /%3E%3Cpath d='M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z' style='stroke: none;'%3E%3C/path%3E%3C/svg%3E")
//     repeat-x;
//   background-size: 1000px 100%;
//   animation: ${waveKeyframes2} 4s linear infinite;
//   opacity: 0.7;
// `;

const triggerEffect = canvasRef => {
  //firework();
  effect();
  //rainEffect(canvasRef);
};

const firework = () => {
  const duration = 15 * 100; // 15초
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      }),
    );

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      }),
    );
  }, 250);
};

const effect = () => {
  var end = Date.now() + 3 * 1000;

  // go Buckeyes!
  var colors = ['#bb0000', '#ffffff'];

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

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  position: relative;
`;

const Status = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: auto;
  padding: 10px;
  color: ${({ theme, $myMissionStatus }) =>
    $myMissionStatus ? theme.colors.primary.emerald : theme.colors.system.red};
  font-size: 40px;
`;

//전체바
const CanvasWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 50px;
  top: 10%;
  /* bottom: ; */

  border: 3px solid ${({ theme }) => theme.colors.primary.light};
`;

// 목적바
const Canvas = styled.canvas`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 70%;
  height: 100%;
  border-right: 4px solid red;
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

const FullScreenCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const FullScreenWave = styled.canvas`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
