import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, SimpleBtn } from '../../components';
import { AccountContext, UserContext } from '../../contexts';
import useFetch from '../../hooks/useFetch';

import * as S from '../../styles/common';

const MyStreak = () => {
  const navigate = useNavigate();
  const { fetchData } = useFetch();
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);
  const { userId } = useContext(AccountContext);
  const { userInfo, setUserInfo, fetchUserData } = useContext(UserContext);
  const { userName, streakDays, medals, affirmation } = userInfo;

  const getUserInfo = async () => {
    setIsUserInfoLoading(true);
    try {
      const response = await fetchData(() => fetchUserData());
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
    getUserInfo();
  }, []);

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
