import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, SimpleBtn } from '../../components';
import { UserContext } from '../../contexts/UserContext';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';

import * as S from '../../styles/common';

const MyStreak = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);
  const { fetchData } = useFetch();
  const { handleCheckAuth } = useAuth();
  const navigate = useNavigate();
  const { userInfo, setUserInfo, fetchUserData, userId } =
    useContext(UserContext);
  const { userName, streakDays, medals, affirmation } = userInfo;

  const checkAuthorize = async () => {
    try {
      const response = await fetchData(() => handleCheckAuth());
      const { isLoading: isAuthLoading, error: authError } = response;
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
    }
  };

  const getUserInfo = async ({ accessToken, userId }) => {
    setIsUserInfoLoading(true);
    try {
      const response = await fetchData(() =>
        fetchUserData({ accessToken, userId }),
      );
      const {
        isLoading: isUserInfoLoading,
        data: userInfoData,
        error: userInfoError,
      } = response;
      if (!isUserInfoLoading && userInfoData) {
        setUserInfo(userInfoData);
        setIsUserInfoLoading(false);
      } else if (userInfoError) {
        setIsUserInfoLoading(false);
        console.error(userInfoError);
        return;
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  useEffect(() => {
    checkAuthorize();
  }, []);

  useEffect(() => {
    if (userId && isAuthorized) {
      getUserInfo({ userId });
    }
  }, [userId, isAuthorized]);

  if (isAuthLoading || isUserInfoLoading) return <div>Loading...</div>;
  if (!isAuthorized) return <div>접근이 허용되지 않은 페이지입니다.</div>;

  return (
    <>
      <NavBar />
      <S.PageWrapper>
        <SimpleBtn key={userId} btnName={userId} />
        <SimpleBtn key={userName} btnName={userName} />
        <SimpleBtn key={streakDays} btnName={streakDays} />
        <SimpleBtn key={medals.gold} btnName={medals.gold} />
        <SimpleBtn key={medals.silver} btnName={medals.silver} />
        <SimpleBtn key={medals.bronze} btnName={medals.bronze} />
        <SimpleBtn key={medals.bronze} btnName={affirmation} />
      </S.PageWrapper>
    </>
  );
};

export default MyStreak;
