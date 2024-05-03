import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './Router';

import { UserContextProvider } from './contexts/UserContext';
import { AccountContextProvider } from './contexts';
import { ChallengeContextProvider } from './contexts/ChallengeContext';

import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import { ThemeProvider } from 'styled-components';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <AccountContextProvider>
        <UserContextProvider>
          <ChallengeContextProvider>
            <Router />
          </ChallengeContextProvider>
        </UserContextProvider>
      </AccountContextProvider>
    </ThemeProvider>
  </>,
);

serviceWorkerRegistration.register();
