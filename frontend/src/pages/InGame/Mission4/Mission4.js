import React, { useContext, useRef, useEffect, useState } from 'react';
import { OpenViduContext, GameContext } from '../../../contexts';
import styled from 'styled-components';

const Mission4 = () => {
  const { myMissionStatus, setMyMissionStatus } = useContext(GameContext);
  const { myStream } = useContext(OpenViduContext);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [decibels, setDecibels] = useState(0); // 데시벨 상태
  const [shoutingDuration, setShoutingDuration] = useState(0); // 함성이 지속된 시간

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
      }
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

  // Canvas에 데시벨 그리기
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

  console.log('=========MY MISSION STATUS: ', myMissionStatus);

  return (
    <>
      <Wrapper>
        <Status $myMissionStatus={myMissionStatus}>
          {myMissionStatus
            ? ' 성공!!!! '
            : `데시벨 도달 확인: ${decibels.toFixed(2)} dB`}{' '}
        </Status>

        <CanvasWrapper>
          <Canvas ref={canvasRef} />
          <SoundIndicator
            $soundWidth={shoutingDuration.toFixed(3) < 5 ? decibels : 0}
          />
        </CanvasWrapper>
      </Wrapper>
    </>
  );
};

export default Mission4;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
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
  bottom: 0;

  border: 3px solid ${({ theme }) => theme.colors.primary.light};
`;

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
