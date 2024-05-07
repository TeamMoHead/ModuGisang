import React, { useContext } from 'react';
import { OpenViduContext, GameContext } from '../../../contexts';
import styled from 'styled-components';

const Mission4 = () => {
  const { myVideoRef } = useContext(OpenViduContext);
  const { myMissionStatus, setMyMissionStatus } = useContext(GameContext);
  // 데시벨 로직
  // setMyMissionStatus(true); // 데시벨 도달 확인
  // 데시벨 그림
  return (
    <Wrapper>
      <Status $myMissionStatus={myMissionStatus}>데시벨 도달 확인</Status>
      Mission4
    </Wrapper>
  );
};

export default Mission4;

const Wrapper = styled.div`
  width: 100px;
  background-color: ${({ theme }) => theme.colors.primary.purple};
`;

const Status = styled.div`
  border: 5px solid;
  border-color: ${({ theme, $myMissionStatus }) =>
    $myMissionStatus ? theme.colors.system.green : theme.colors.system.red};
`;
