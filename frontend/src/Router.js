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
  CustomerService,
  DeleteUser,
  About,
} from './pages';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signIn" element={<Signin />} />
        <Route path="/signUp" element={<Signup />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/termsOfService" element={<TermsOfService />} />
        <Route path="/customerService" element={<CustomerService />} />
        <Route path="/deleteUser" element={<DeleteUser />} />
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
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
