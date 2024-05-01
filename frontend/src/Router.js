import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Auth,
  Main,
  InGame,
  MyStreak,
  CreateChallenge,
  Settings,
} from './pages';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/main" element={<Main />} />
        <Route path="/myStreak" element={<MyStreak />} />
        <Route path="/inGame" element={<InGame />} />
        <Route path="/createChallenge" element={<CreateChallenge />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
