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
import SignIn from './pages/Auth/Signin';
import SignUp from './pages/Auth/Signup';
import { GameContextProvider, OpenViduContextProvider } from './contexts';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/signIn" element={<SignIn />} />
        <Route path="/auth/signUp" element={<SignUp />} />
        <Route path="/myStreak" element={<MyStreak />} />
        <Route path="/joinChallenge" element={<JoinChallenge />} />
        <Route path="/createChallenge" element={<CreateChallenge />} />
        <Route
          path="/startMorning/:challengeId/*"
          element={
            <GameContextProvider>
              <OpenViduContextProvider>
                <InGame />
              </OpenViduContextProvider>
            </GameContextProvider>
          }
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
