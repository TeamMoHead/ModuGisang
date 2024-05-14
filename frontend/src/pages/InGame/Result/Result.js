import React, { useState, useEffect, useContext } from 'react';
import { ChallengeContext, GameContext } from '../../../contexts';
import useFetch from '../../../hooks/useFetch';
import { userServices } from '../../../apis';

import styled from 'styled-components';

const Result = () => {
  const { fetchData } = useFetch();
  const { inGameMode, gameResults, getGameResults } = useContext(GameContext);
  const { challengeData } = useContext(ChallengeContext);
  const [matesData, setMatesData] = useState([]);

  useEffect(() => {
    if (inGameMode === 6) {
      if (gameResults === null) {
        getGameResults();
      }
    }
  }, [inGameMode, gameResults]);

  useEffect(() => {
    if (matesData.length === 0) {
      const response = fetchData(() => userServices.getUserInfo());
    }
  }, [challengeData]);

  console.log('RESULT COMPONENT:: ', gameResults);
  return <Wrapper>Result</Wrapper>;
};

export default Result;

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;
