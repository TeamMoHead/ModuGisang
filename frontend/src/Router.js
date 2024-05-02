import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Auth,
  Main,
  InGame,
  MyStreak,
  CreateChallenge,
  JoinChallenge,
  Settings,
} from './pages';
import { GameContextProvider } from './contexts/GameContext';
import { ChallengeContextProvider } from './contexts/ChallengeContext';

import InGameRouter from './pages/InGame/InGameRouter';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ChallengeContextProvider>
              <Main />
            </ChallengeContextProvider>
          }
        />
        <Route path="/auth" element={<Auth />} />
        <Route path="/myStreak" element={<MyStreak />} />
        <Route path="/joinChallenge" element={<JoinChallenge />} />
        <Route path="/createChallenge" element={<CreateChallenge />} />
        <Route
          path="/startMorning/:challengeId/*"
          element={
            <ChallengeContextProvider>
              <GameContextProvider>
                <InGame />
              </GameContextProvider>
            </ChallengeContextProvider>
          }
        />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="*"
          element={
            <ChallengeContextProvider>
              <Main />
            </ChallengeContextProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
