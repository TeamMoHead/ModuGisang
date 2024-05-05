import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../../contexts/AccountContexts';
import { UserContext } from '../../contexts/UserContext';
import { authServices } from '../../apis/authServices';
import useFetch from '../../hooks/useFetch';
import { SimpleBtn } from '../../components';

import * as S from '../../styles/common';

const Auth = () => {
  const { accessToken, setAccessToken } = useContext(AccountContext);
  const { userId, setUserId } = useContext(UserContext);
  const { fetchDataWithStatus } = useFetch();
  const navigate = useNavigate();
  const deleteRefreshToken = async () => {
    try {
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      alert('로그아웃 되었습니다.');
      navigate('/auth');
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handleLogOut = async accessToken => {
    try {
      console.log('AT', accessToken);
      const response = await fetchDataWithStatus(() =>
        authServices.logOutUser({ accessToken: accessToken }),
      );
      const {
        isLoading: logoutLoading,
        data: logoutData,
        error: logoutError,
        status: logoutStatus,
        statusText: logoutStatusText,
      } = response;
      if (logoutStatus === 200) {
        alert('로그아웃 되었습니다.');
        navigate('/auth');
      } else if (logoutError) {
        alert(logoutError);
        return;
      }
    } catch (e) {
      console.error(e);
      alert(e);
    }
  };
  const goToSignIn = () => {
    navigate('/auth/signIn');
  };

  const goToSignUp = () => {
    navigate('/auth/signUp');
  };

  useEffect(() => {
    console.log('AT', accessToken);
    console.log('RT', localStorage.getItem('refreshToken'));
    console.log('UID', userId);
  }, [accessToken, userId]);

  // if (
  //   isLoginLoading ||
  //   isSignUpLoading ||
  //   isEmailCheckLoading ||
  //   isLogoutLoading
  // )
  //   return <div>Loading...</div>;

  return (
    <S.PageWrapper>
      Auth
      <SimpleBtn onClickHandler={goToSignIn} btnName="로그인 하기!" />
      <SimpleBtn onClickHandler={goToSignUp} btnName="회원가입 하기!" />
      <SimpleBtn
        onClickHandler={() => {
          handleLogOut(accessToken);
        }}
        btnName="로그아웃"
      />
      <SimpleBtn
        onClickHandler={deleteRefreshToken}
        btnName="리프레시토큰 삭제"
      />
    </S.PageWrapper>
  );
};

export default Auth;
