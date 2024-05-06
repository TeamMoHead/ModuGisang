import React, { createContext, useState, useEffect, useContext } from 'react';

import { ChallengeContext } from './';
import useCheckTime from '../hooks/useCheckTime';

const GameContext = createContext();

const GAME_MODE = {
  0: 'waiting',
  1: 'mission1',
  2: 'mission2',
  3: 'mission3',
  4: 'mission4',
  5: 'affirmation',
  6: 'result',
};

// mission 당 소요 시간
const GAME_MODE_DURATION = {
  1: 15000,
  2: 15000,
  3: 15000,
  4: 10000,
  5: 10000,
};

const GameContextProvider = ({ children }) => {
  const { challengeData } = useContext(ChallengeContext);
  const { remainingTime, isTooLate, isTooEarly } = useCheckTime(
    challengeData?.wakeTime,
  );

  const [myMissionStatus, setMyMissionStatus] = useState(false);
  const [matesMissionStatus, setMatesMissionStatus] = useState({
    // [userId]: { missionCompleted: boolean } 형태"
  });

  const [isGameLoading, setIsGameLoading] = useState(false);
  const [inGameMode, setInGameMode] = useState(
    // parseInt(localStorage.getItem('inGameMode')) || 0,
    0,
  );

  let nextGameMode = 1;

  const updateMode = () => {
    nextGameMode += 1;
    if (nextGameMode <= 7) {
      // localStorage.setItem('inGameMode', JSON.stringify(nextGameMode));
      setInGameMode(nextGameMode);
      setIsGameLoading(true);
      setMyMissionStatus(false); // 미션 수행상태 초기화

      if (GAME_MODE[nextGameMode] !== 'result') {
        setTimeout(updateMode, GAME_MODE_DURATION[nextGameMode]);
      }

      if (GAME_MODE[nextGameMode] === 'result') {
        // localStorage.setItem('inGameMode', JSON.stringify(6));
      }
    }
  };

  const scheduleFirstMission = () => {
    setTimeout(() => {
      setInGameMode(1); // waiting 끝나면 첫 미션으로 전환
      setIsGameLoading(true); // 게임 로딩 시작
      setMyMissionStatus(false); // 미션 수행상태 초기화
      setTimeout(updateMode, GAME_MODE_DURATION[1]); // 첫 미션 후 다음 모드로 전환 시작
    }, remainingTime);
  };

  useEffect(() => {
    if (challengeData && !isTooEarly && !isTooLate) {
      scheduleFirstMission();
    }
  }, [challengeData]);

  useEffect(() => {
    console.log('@@@@@ MATE MISSION STATUS @@@@@ => ', matesMissionStatus);
  }, [matesMissionStatus]);

  console.log(
    '^^^^^^GAME CONTEXT^^^^^ game mode, remaining time, my mission status=> ',
    inGameMode,
    remainingTime,
    myMissionStatus,
  );
  return (
    <GameContext.Provider
      value={{
        inGameMode,
        isGameLoading,
        setIsGameLoading,
        myMissionStatus,
        setMyMissionStatus,
        matesMissionStatus,
        setMatesMissionStatus,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameContextProvider };
