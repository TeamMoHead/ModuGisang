import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  GameContextProvider,
  OpenViduContextProvider,
  SafeAreaContextProvider,
} from './contexts';
import { Signin, Signup, ForgotPassword, ProtectedRoute } from './pages/Auth';
import { PageNotFound, OfflinePage } from './components';
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
  ChangePassword,
  About,
} from './pages';

import SafeAreaLayout from './components/SafeArea';

function Router() {
  return (
    <BrowserRouter>
      <SafeAreaContextProvider>
        <Routes>
          <Route path="/signIn" element={<Signin />} />
          <Route
            path="/signUp"
            element={
              <SafeAreaLayout>
                <Signup />
              </SafeAreaLayout>
            }
          />
          <Route
            path="/privacyPolicy"
            element={
              <SafeAreaLayout>
                <PrivacyPolicy />
              </SafeAreaLayout>
            }
          />
          <Route
            path="/termsOfService"
            element={
              <SafeAreaLayout>
                <TermsOfService />
              </SafeAreaLayout>
            }
          />
          <Route
            path="/customerService"
            element={
              <SafeAreaLayout>
                <CustomerService />
              </SafeAreaLayout>
            }
          />
          <Route
            path="/deleteUser"
            element={
              <SafeAreaLayout>
                <DeleteUser />
              </SafeAreaLayout>
            }
          />
          <Route
            path="/forgotPassword"
            element={
              <SafeAreaLayout>
                <ForgotPassword />
              </SafeAreaLayout>
            }
          />
          <Route path="/about" element={<About />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <SafeAreaLayout>
                  <Main />
                </SafeAreaLayout>
              }
            />
            <Route
              path="/main"
              element={
                <SafeAreaLayout>
                  <Main />
                </SafeAreaLayout>
              }
            />
            <Route
              path="/myStreak"
              element={
                <SafeAreaLayout>
                  <MyStreak />
                </SafeAreaLayout>
              }
            />
            <Route
              path="/joinChallenge"
              element={
                <SafeAreaLayout>
                  <JoinChallenge />
                </SafeAreaLayout>
              }
            />
            <Route
              path="/createChallenge"
              element={
                <SafeAreaLayout>
                  <CreateChallenge />
                </SafeAreaLayout>
              }
            />
            <Route
              path="/startMorning"
              element={
                <GameContextProvider>
                  <OpenViduContextProvider>
                    <SafeAreaLayout>
                      <InGame />
                    </SafeAreaLayout>
                  </OpenViduContextProvider>
                </GameContextProvider>
              }
            />
            <Route
              path="/settings"
              element={
                <SafeAreaLayout>
                  <Settings />
                </SafeAreaLayout>
              }
            />
            <Route
              path="/changePassword"
              element={
                <SafeAreaLayout>
                  <ChangePassword />
                </SafeAreaLayout>
              }
            />
          </Route>
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </SafeAreaContextProvider>
    </BrowserRouter>
  );
}

export default Router;
