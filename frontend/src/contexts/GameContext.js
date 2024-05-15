import React, { createContext, useState, useEffect, useContext } from 'react';

import { AccountContext, ChallengeContext, UserContext } from './';
import { inGameServices } from '../apis';
import useCheckTime from '../hooks/useCheckTime';
import useFetch from '../hooks/useFetch';

const GameContext = createContext();

const GAME_MODE = {
  0: 'waiting',
  1: 'mission1',
  2: 'mission2',
  3: 'mission3',
  4: 'mission4',
  5: 'mission5',
  6: 'affirmation',
  7: 'result',
};

// mission 당 소요 시간
const GAME_MODE_DURATION = {
  1: 21500,
  2: 19000,
  3: 17000,
  4: 14500,
  5: 13000,
  6: 8000,
};

const RESULT_TIME = 2000;

const GameContextProvider = ({ children }) => {
  const { fetchData } = useFetch();
  const { accessToken, userId } = useContext(AccountContext);
  const { myData } = useContext(UserContext);
  const { challengeData } = useContext(ChallengeContext);
  const { remainingTime, isTooLate, isTooEarly } = useCheckTime(
    challengeData?.wakeTime,
  );

  // =================== MUSIC STATUS =====================
  const [isMusicMuted, setIsMusicMuted] = useState(true);
  // =====================================================
  //
  //

  // =================== MISSION STATUS =====================
  const [myMissionStatus, setMyMissionStatus] = useState(false);
  const [matesMissionStatus, setMatesMissionStatus] = useState({
    // [userId]: { missionCompleted: boolean } 형태"
  });

  const [isMissionStarting, setIsMissionStarting] = useState(false);
  const [isMissionEnding, setIsMissionEnding] = useState(false);
  // ==============================================================
  //
  //

  // =================== GAME STATUS ===================
  const [inGameMode, setInGameMode] = useState(
    // parseInt(localStorage.getItem('inGameMode')) || 0,
    // 6,
    5,
  );
  const [isEnteredTimeSent, setIsEnteredTimeSent] = useState(false);
  const [isGameScoreSent, setIsGameScoreSent] = useState(false);
  const [gameScore, setGameScore] = useState(0); // Mission1, 2, 3, 4에서 축적되는 점수
  const [isGameResultReceived, setIsGameResultReceived] = useState(false);
  const [gameResults, setGameResults] = useState([
    // { userId: 'int',
    //  userName: 'string',
    //   score: 'number'
    //  },
  ]);
  //
  // ====================================================

  // =================== GET & POSE GAME INFO ===================
  const sendEnteredTime = async () => {
    const response = await fetchData(() =>
      inGameServices.sendEnteredTime({ accessToken, userId }),
    );

    const { isLoading, data, error } = response;
    if (!isLoading && data) {
      console.log('Entered Time Sent Successfully=> ', data);
      setIsEnteredTimeSent(true);
    } else {
      console.error('Entered Time Sent Error => ', error);
    }
  };

  const sendMyGameScore = async () => {
    const { userId, userName, challengeId } = myData;
    const userData = {
      userId,
      userName,
      challengeId,
      gameScore,
    };
    const response = await fetchData(() =>
      inGameServices.sendMyGameScore({ accessToken, userData }),
    );
    const { isLoading, data, error } = response;
    if (!isLoading && data) {
      console.log('My Game Score Sent Successfully => ', data);
      setIsGameScoreSent(true);
    } else {
      console.error('My Game Score Sent Error => ', error);
    }
  };

  const getGameResults = async () => {
    const response = await fetchData(() =>
      inGameServices.getGameResults({ accessToken }),
    );
    const { isLoading, data, error } = response;
    if (!isLoading && data) {
      console.log('Game Results => ', data);
      setGameResults(data);
      setIsGameResultReceived(true);
      return data;
    } else {
      console.error('Game Results Error => ', error);
    }
  };
  // ====================================================

  // =================== GAME MODE UPDATE ===================
  let nextGameMode = 1;
  const updateMode = () => {
    nextGameMode += 1;
    if (nextGameMode <= 7) {
      // localStorage.setItem('inGameMode', JSON.stringify(nextGameMode));
      setInGameMode(nextGameMode);
      setIsMissionStarting(true);
      setIsMissionEnding(false);
      setMyMissionStatus(false); // 미션 수행상태 초기화

      if (GAME_MODE[nextGameMode] !== 'result') {
        setTimeout(() => {
          setIsMissionEnding(true);
          setTimeout(() => {
            updateMode();
          }, RESULT_TIME);
        }, GAME_MODE_DURATION[nextGameMode]);
      }

      if (GAME_MODE[nextGameMode] === 'result') {
        // localStorage.setItem('inGameMode', JSON.stringify(6));
      }
    }
  };

  const scheduleFirstMission = () => {
    setTimeout(() => {
      setInGameMode(1); // waiting 끝나면 첫 미션으로 전환
      setIsMissionStarting(true); // 게임 로딩 시작
      setMyMissionStatus(false); // 미션 수행상태 초기화
      setIsMissionEnding(false);
      setTimeout(() => {
        setIsMissionEnding(true); // 첫 미션 종료 후 결과 표시
        setTimeout(() => {
          updateMode();
        }, RESULT_TIME);
      }, GAME_MODE_DURATION[1]); // 첫 미션 지속 시간
    }, remainingTime);
  };

  useEffect(() => {
    if (challengeData && !isTooEarly && !isTooLate) {
      // ⭐️⭐️⭐️⭐️⭐️⭐️ 개발 편의 용 주석 ⭐️⭐️⭐️⭐️⭐️//
      // 나중에 다시 풀어야 함
      scheduleFirstMission();
      // ===== ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ ==================
    }
  }, [challengeData]);

  // ================= ⬆⬆⬆⬆ GAME MODE UPDATE ⬆⬆⬆⬆ =================

  useEffect(() => {
    console.log('@@@@@ MATE MISSION STATUS @@@@@ => ', matesMissionStatus);
  }, [matesMissionStatus]);

  console.log(
    '🍀🍀🍀 GAME CONTEXT 🍀🍀🍀 game mode // my mission status // score // musicMuted => ',
    inGameMode,
    myMissionStatus,
    gameScore,
    isMusicMuted,
  );

  return (
    <GameContext.Provider
      value={{
        inGameMode,
        //
        isMusicMuted,
        setIsMusicMuted,
        //
        isMissionStarting,
        setIsMissionStarting,
        isMissionEnding,
        setIsMissionEnding,
        //
        myMissionStatus,
        setMyMissionStatus,
        matesMissionStatus,
        setMatesMissionStatus,
        //
        isEnteredTimeSent,
        setIsEnteredTimeSent,
        sendEnteredTime,
        //
        isGameScoreSent,
        gameScore,
        setGameScore,
        sendMyGameScore,
        //
        gameResults,
        isGameResultReceived,
        setGameResults,
        getGameResults,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameContextProvider };
