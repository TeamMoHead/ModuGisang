import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameContextProvider, OpenViduContextProvider } from './contexts';
import {
  Auth,
  Signin,
  Signup,
  ForgotPassword,
  ProtectedRoute,
} from './pages/Auth';
import { PageNotFound } from './components';
import {
  Main,
  InGame,
  MyStreak,
  CreateChallenge,
  JoinChallenge,
  Settings,
  PrivacyPolicy,
  TermsOfService,
  ChangePassword,
  About,
} from './pages';

import { SafeAreaProvider } from './contexts/SafeAreaContext'; // SafeAreaProvider 추가
import SafeArea from './styles/SafeArea'; // SafeAreaWrapper를 가져옴

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/auth" element={<Auth />} /> */}
        <Route path="/signIn" element={<Signin />} />
        <Route path="/signUp" element={<Signup />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/termsOfService" element={<TermsOfService />} />
        <Route path="/about" element={<About />} />
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
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/test" element={<Testing />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
