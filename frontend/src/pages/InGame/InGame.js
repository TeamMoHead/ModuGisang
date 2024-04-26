import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Thumbnail from './components/Thumbnail';
import styled from 'styled-components';
import * as S from '../../styles/common';

const stages = {
  waiting: 'waiting',
  mission0: 'mission0',
  mission1: 'mission1',
  mission2: 'mission2',
  mission3: 'mission3',
  mission4: 'mission4',
  affirmation: 'affirmation',
  result: 'result',
};

const InGame = () => {
  // 유효한 사용자만이 이 페이지에 접근할 수 있도록 하기
  const params = useParams();
  const { challengeId } = params;
  const [stage, setStage] = useState(stages.waiting);
  const [stream, setStream] = useState(null);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);
    } catch (error) {
      console.error(error);
      setStream(null);
    }
  };

  // 현재시간과 challenge 시작시간 비교해서,
  // challenge 시작시간이 지났으면 setIsWaiting(false)
  useEffect(() => {
    console.log('Challenge ID: ', challengeId);
  }, []);

  return (
    <S.PageWrapper>
      InGame
      <CloseVideoBtn
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          stopCamera();
        }}
      >
        stop camera
      </CloseVideoBtn>
    </S.PageWrapper>
  );
};

export default InGame;

const CloseVideoBtn = styled.button`
  width: 100px;
  height: 50px;
  border-radius: ${({ theme }) => theme.radius.round};
  background-color: orange;
  color: white;
  cursor: pointer;
`;
