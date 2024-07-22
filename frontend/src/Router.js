import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameContextProvider, OpenViduContextProvider } from './contexts';
import { Signin, Signup, ProtectedRoute } from './pages/Auth';
import { PageNotFound } from './components';
import {
  Main,
  InGame,
  MyStreak,
  CreateChallenge,
  JoinChallenge,
  Settings,
  Testing,
  WorkerTest,
} from './pages';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signIn" element={<Signin />} />
        <Route path="/signUp" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Main />} />
          <Route path="/main" element={<Main />} />
          <Route path="/myStreak" element={<MyStreak />} />
          <Route path="/joinChallenge" element={<JoinChallenge />} />
          <Route path="/createChallenge" element={<CreateChallenge />} />
          <Route
            path="/startMorning"
            element={
              <GameContextProvider>
                <OpenViduContextProvider>
                  <InGame />
                </OpenViduContextProvider>
              </GameContextProvider>
            }
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/test" element={<Testing />} />
          <Route path="/worker-test" element={<WorkerTest />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
