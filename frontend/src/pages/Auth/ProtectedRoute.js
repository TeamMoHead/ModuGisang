import React, { useContext, useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {
  AccountContext,
  UserContextProvider,
  ChallengeContextProvider,
  MediaPipeContextProvider,
} from '../../contexts';
import useAuth from '../../hooks/useAuth';
import { LoadingWithText } from '../../components';

const ProtectedRoute = () => {
  const { accessToken, userId } = useContext(AccountContext);
  const { checkAuth } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const checkAuthorize = async () => {
    setIsAuthLoading(true);
    const response = await checkAuth();
    if (response) {
      setIsAuthLoading(false);
      setIsAuthorized(true);
    }
  };

  useEffect(() => {
    checkAuthorize();

    console.log('checking authorization...');
    console.log('AT', accessToken);
    console.log('RT', localStorage.getItem('refreshToken'));
    console.log('USER ID: ', userId);
  }, [accessToken]);

  if (isAuthLoading) {
    return <LoadingWithText text="로그인 정보를 확인중이에요 :)" />;
  }

  if (!isAuthLoading && !isAuthorized) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <UserContextProvider>
      <ChallengeContextProvider>
        <MediaPipeContextProvider>
          <Outlet />
        </MediaPipeContextProvider>
      </ChallengeContextProvider>
    </UserContextProvider>
  );
};

export default ProtectedRoute;
