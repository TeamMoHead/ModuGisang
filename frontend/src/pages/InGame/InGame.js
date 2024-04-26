import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const InGame = () => {
  const [isWaiting, setIsWaiting] = useState(true);
  const params = useParams();
  const { challengeId } = params;

  // 현재시간과 challenge 시작시간 비교해서,
  // challenge 시작시간이 지났으면 setIsWaiting(false)

  return <Wrapper>InGame</Wrapper>;
};

export default InGame;

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.center}
`;
