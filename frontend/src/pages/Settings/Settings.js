import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from '../../contexts/AccountContexts';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import { NavBar } from '../../components';
import * as S from '../../styles/common';

const Settings = () => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const { logOut } = useContext(AccountContext);
  const { fetchData } = useFetch();
  const { handleCheckAuth } = useAuth();
  const navigate = useNavigate();

  const checkAuthorize = async () => {
    try {
      const response = await fetchData(() => handleCheckAuth());
      const {
        isLoading: isAuthLoading,
        data: authData,
        error: authError,
      } = response;
      if (!isAuthLoading) {
        setIsAuthLoading(false);
        setIsAuthorized(true);
      } else if (authError) {
        setIsAuthLoading(false);
        setIsAuthorized(false);
        navigate('/auth');
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handleLogOut = async () => {
    try {
      setIsLogoutLoading(true);
      const response = await fetchData(() => logOut());
      const {
        isLoading: isLogoutLoading,
        data: logoutData,
        error: logoutError,
      } = response;
      if (!isLogoutLoading) {
        alert('로그아웃 되었습니다.');
        navigate('/auth');
        setIsLogoutLoading(false);
      } else if (logoutError) {
        alert(logoutError);
        setIsLogoutLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  useEffect(() => {
    checkAuthorize();
  }, []);

  if (isLogoutLoading || isAuthLoading) return <div>Loading...</div>;
  if (!isAuthorized) return <div>접근이 허용되지 않은 페이지입니다.</div>;

  return (
    <>
      <NavBar />

      <S.PageWrapper>
        Settings
        <button onClick={handleLogOut}>Log Out</button>
      </S.PageWrapper>
    </>
  );
};

export default Settings;
