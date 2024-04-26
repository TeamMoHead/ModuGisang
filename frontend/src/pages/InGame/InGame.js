import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Thumbnail from './components/Thumbnail';

const InGame = () => {
  const [isWaiting, setIsWaiting] = useState(true);
  const params = useParams();
  const { challengeId } = params;
  const [stream, setStream] = useState(null);

  // 현재시간과 challenge 시작시간 비교해서,
  // challenge 시작시간이 지났으면 setIsWaiting(false)
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(stream => {
        setStream(stream);
      })
      .catch(() => {
        setStream(null);
      });
  }, []);

  return (
    <Wrapper>
      InGame
      <ThumbnailWrapper>
        <Thumbnail stream={stream} isActive={false} />
        <Thumbnail stream={stream} isActive={true} />
        <Thumbnail stream={stream} isActive={false} />
        <Thumbnail stream={stream} isActive={true} />
      </ThumbnailWrapper>
    </Wrapper>
  );
};

export default InGame;

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
`;

const ThumbnailWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 20%;
  justify-content: space-evenly;
  flex-direction: row;
`;
