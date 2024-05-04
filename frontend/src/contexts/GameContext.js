import React, { createContext, useState, useEffect, useContext } from 'react';

import { ChallengeContext } from './';

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
  const [inGameMode, setInGameMode] = useState(
    localStorage.getItem('inGameMode') || 0,
  );
  const [myMissionStatus, setMyMissionStatus] = useState(false);
  const [matesMissionStatus, setMatesMissionStatus] = useState({
    // [userId]: { missionCompleted: boolean } 형태"
  });

  let nextMode = 1;

  const updateMode = () => {
    nextMode += 1;
    if (nextMode <= 7) {
      localStorage.setItem('inGameMode', JSON.stringify(nextMode));
      setInGameMode(nextMode);
      setMyMissionStatus(false); // 미션 수행상태 초기화

      if (nextMode !== 6) {
        // result 모드 아니면 다음 모드로 자동 전환
        setTimeout(updateMode, GAME_MODE_DURATION[nextMode]);
      }

      if (nextMode === 6) {
        localStorage.setItem('inGameMode', JSON.stringify(0));
      }
    }
  };

  const scheduleFirstMission = wakeTime => {
    const now = new Date();
    const wakeTimeDate = new Date(now);
    const [hours, minutes] = wakeTime.split(':').map(Number);
    wakeTimeDate.setHours(hours, minutes, 0, 0);

    // 이미 지난 시간인 경우 다음날로 설정
    if (wakeTimeDate < now) {
      wakeTimeDate.setDate(now.getDate() + 1);
    }

    const delay = wakeTimeDate - now;

    setTimeout(() => {
      setInGameMode(1); // waiting 끝나면 첫 미션으로 전환
      setMyMissionStatus(false); // 미션 수행상태 초기화
      setTimeout(updateMode, GAME_MODE_DURATION[1]); // 첫 미션 후 다음 모드로 전환 시작
    }, delay);
  };

  useEffect(() => {
    if (challengeData) {
      scheduleFirstMission(challengeData.wakeTime);
    }
  }, [challengeData]);

  useEffect(() => {
    console.log('@@@@@ MATE MISSION STATUS @@@@@ => ', matesMissionStatus);
  }, [matesMissionStatus]);

  return (
    <GameContext.Provider
      value={{
        inGameMode,
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
