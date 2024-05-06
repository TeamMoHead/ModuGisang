import React, { useContext, useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {
  AccountContext,
  UserContextProvider,
  ChallengeContextProvider,
} from '../../contexts';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = () => {
  const { accessToken, userId } = useContext(AccountContext);
  const { handleCheckAuth } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const checkAuthorize = async () => {
    setIsAuthLoading(true);
    const response = await handleCheckAuth();
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
    return <div>Loading...</div>;
  }

  if (!isAuthLoading && !isAuthorized) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <UserContextProvider>
      <ChallengeContextProvider>
        <Outlet />
      </ChallengeContextProvider>
    </UserContextProvider>
  );
};

export default ProtectedRoute;
