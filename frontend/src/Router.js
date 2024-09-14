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
  PrivacyPolicy,
  TermsOfService,
  About,
} from './pages';

import { SafeAreaProvider } from './contexts/SafeAreaContext'; // SafeAreaProvider 추가
import SafeArea from './styles/SafeArea'; // SafeAreaWrapper를 가져옴

function Router() {
  return (
    <BrowserRouter>
      <SafeAreaProvider>
        <Routes>
          <Route path="/signIn" element={<Signin />} />
          <Route path="/signUp" element={<Signup />} />
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/termsOfService" element={<TermsOfService />} />
          <Route path="/about" element={<About />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <SafeArea>
                  <Main />
                </SafeArea>
              }
            />
            <Route
              path="/main"
              element={
                <SafeArea>
                  <Main />
                </SafeArea>
              }
            />
            <Route
              path="/myStreak"
              element={
                <SafeArea>
                  <MyStreak />
                </SafeArea>
              }
            />
            <Route
              path="/joinChallenge"
              element={
                <SafeArea>
                  <JoinChallenge />
                </SafeArea>
              }
            />
            <Route
              path="/createChallenge"
              element={
                <SafeArea>
                  <CreateChallenge />
                </SafeArea>
              }
            />
            <Route
              path="/startMorning"
              element={
                <GameContextProvider>
                  <OpenViduContextProvider>
                    <SafeArea>
                      <InGame />
                    </SafeArea>
                  </OpenViduContextProvider>
                </GameContextProvider>
              }
            />
            <Route
              path="/settings"
              element={
                <SafeArea>
                  <Settings />
                </SafeArea>
              }
            />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </SafeAreaProvider>
    </BrowserRouter>
  );
}

export default Router;
