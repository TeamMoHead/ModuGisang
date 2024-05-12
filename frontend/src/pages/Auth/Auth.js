import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../../contexts';
import useFetch from '../../hooks/useFetch';
import { authServices } from '../../apis/authServices';
import { LongBtn } from '../../components';

import * as S from '../../styles/common';

const Auth = () => {
  const { accessToken, setAccessToken } = useContext(AccountContext);
  const { fetchData } = useFetch();
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
      const response = await fetchData(() =>
        authServices.logOutUser({ accessToken: accessToken }),
      );
      const {
        isLoading: logoutLoading,
        data: logoutData,
        error: logoutError,
        status: logoutStatus,
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
  }, [accessToken]);

  return (
    <S.PageWrapper>
      Auth
      <LongBtn onClickHandler={goToSignIn} btnName="로그인 하기!" />
      <LongBtn onClickHandler={goToSignUp} btnName="회원가입 하기!" />
      <LongBtn
        onClickHandler={() => {
          handleLogOut(accessToken);
        }}
        btnName="로그아웃"
      />
      <LongBtn
        onClickHandler={deleteRefreshToken}
        btnName="리프레시토큰 삭제"
      />
    </S.PageWrapper>
  );
};

export default Auth;
