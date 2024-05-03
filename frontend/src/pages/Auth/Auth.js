import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../../contexts/AccountContexts';
import { UserContext } from '../../contexts/UserContext';
import { authServices } from '../../apis/authServices';
import useFetch from '../../hooks/useFetch';
import { SimpleBtn } from '../../components';
import UserForm from '../../components/InputBox';

import * as S from '../../styles/common';

const Auth = () => {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [isEmailCheckLoading, setIsEmailCheckLoading] = useState(false);
  const [isVerifyCodeLoading, setIsVerifyCodeLoading] = useState(false);
  const { accessToken, setAccessToken } = useContext(AccountContext);
  const { userId, setUserId } = useContext(UserContext);
  const { fetchDataWithStatus } = useFetch();
  const navigate = useNavigate();

  const handleLogIn = async (email, password) => {
    setIsLoginLoading(true);
    try {
      const response = await fetchDataWithStatus(() =>
        authServices.logInUser({
          email: email,
          password: password,
        }),
      );
      const {
        isLoading: loginLoading,
        data: loginData,
        error: loginError,
        status: loginStatus,
        statusText: loginStatusText,
      } = response;
      if (loginStatus === 201) {
        setAccessToken(loginData.accessToken);
        localStorage.setItem('refreshToken', loginData.refreshToken);
        setUserId(loginData.userId);
        setIsLoginLoading(false);
        navigate('/');
      } else if (loginStatus === 401 && loginError) {
        alert('이메일 또는 비밀번호가 일치하지 않습니다.');
        setIsLoginLoading(false);
        return;
      }
    } catch (e) {
      console.error(e);
      alert(e);
      setIsLoginLoading(false);
    }
  };

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
    setIsLogoutLoading(true);
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
      console.log(response);
      if (logoutStatus === 200) {
        alert('로그아웃 되었습니다.');
        setIsLogoutLoading(false);
        navigate('/auth');
      } else if (logoutError) {
        alert(logoutError);
        setIsLogoutLoading(false);
        return;
      }
    } catch (e) {
      console.error(e);
      alert(e);
      setIsLogoutLoading(false);
    }
  };

  const handleSignUp = async ({ email, password, userName }) => {
    setIsSignUpLoading(true);
    try {
      const response = await fetchDataWithStatus(() =>
        authServices.signUpUser({
          email: email,
          password: password,
          userName: userName,
        }),
      );
      const {
        isLoading: signUpLoading,
        data: signUpData,
        error: signUpError,
        status: signUpStatus,
        statusText: signUpStatusText,
      } = response;
      console.log(response);
      if (signUpStatus === 201) {
        alert('회원가입이 완료되었습니다.');
        setIsSignUpLoading(false);
      } else if (signUpError) {
        setIsSignUpLoading(false);
        alert(signUpError);
        return;
      }
    } catch (e) {
      console.error(e);
      alert(e);
      setIsSignUpLoading(false);
    }
  };

  const handleEmailCheck = async email => {
    setIsEmailCheckLoading(true);
    try {
      const response = await fetchDataWithStatus(() =>
        authServices.checkEmailAvailability({ email: email }),
      );
      const {
        isLoading: emailCheckLoading,
        data: emailCheckData,
        error: emailCheckError,
        status: emailCheckStatus,
        statusText: emailCheckStatusText,
      } = response;
      console.log(response);
      if (emailCheckStatus === 200) {
        alert('사용 가능한 이메일입니다.');
        setIsEmailCheckLoading(false);
      } else if (emailCheckError) {
        setIsEmailCheckLoading(false);
        alert(emailCheckError);
        return;
      }
    } catch (e) {
      console.error(e);
      alert(e);
      setIsEmailCheckLoading(false);
    }
  };

  const handleVerifyCode = async (verifyCode, email) => {
    // setIsVerifyCodeLoading(true);
    try {
      const response = await fetchDataWithStatus(() =>
        authServices.verifyAuthCode({ verifyCode: verifyCode, email: email }),
      );
      const {
        isLoading: verifyCodeLoading,
        data: verifyCodeData,
        error: verifyCodeError,
        status: verifyCodeStatus,
        statusText: verifyCodeStatusText,
      } = response;
      console.log(response);
      if (verifyCodeStatus === 200) {
        console.log('인증번호 확인 완료');
        // setIsVerifyCodeLoading(false);
      } else if (verifyCodeError) {
        // setIsVerifyCodeLoading(false);
        alert(verifyCodeError);
        return;
      }
    } catch (e) {
      console.error(e);
      alert(e);
      // setIsVerifyCodeLoading(false);
    }
  };

  useEffect(() => {
    console.log('AT', accessToken);
    console.log('RT', localStorage.getItem('refreshToken'));
    console.log('UID', userId);
    if (!isLoginLoading && accessToken && userId) {
      alert('로그인 되었습니다.');
      // navigate('/');
    }
  }, [isLoginLoading, accessToken, userId, navigate]);

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
      <UserForm
        onClickHandler={{
          handleSignUp,
          handleEmailCheck,
          handleLogIn,
          handleVerifyCode,
        }}
      />
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
