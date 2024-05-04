import React from 'react';

import { useState } from 'react';
import { InputBox, SimpleBtn } from '../../components';
import useAuth from '../../hooks/useAuth';
import * as S from '../../styles/common';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailCheckLoading, setIsEmailCheckLoading] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [isVerifyCodeChecked, setIsVerifyCodeChecked] = useState(false);
  const [isVerifyCodeCheckLoading, setIsVerifyCodeCheckLoading] =
    useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  const { handleEmailCheck, handleCheckVerifyCode, handleSignUpSubmit } =
    useAuth();

  const handleEmailChange = e => {
    console.log('email changed: ', e.target.value);
    setEmail(e.target.value);
    setIsEmailChecked(false);
  };

  const handleUserNameChange = e => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  const handleVerifyCodeChange = e => {
    console.log('verify code changed: ', e.target.value);
    setVerifyCode(e.target.value);
  };

  if (isSignUpLoading || isEmailCheckLoading || isVerifyCodeCheckLoading) {
    return <div>회원가입 중...</div>;
  }

  return (
    <S.PageWrapper>
      회원가입
      <form>
        <InputBox
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          disabled={isEmailChecked}
        />
        <SimpleBtn
          onClickHandler={async e =>
            await handleEmailCheck({
              e,
              email,
              setIsEmailChecked,
              setIsEmailCheckLoading,
            })
          }
          disabled={isEmailChecked}
          btnName="중복 체크"
          style={{ backgroundColor: isEmailChecked ? 'gray' : 'white' }}
        />
        <InputBox
          label="Code"
          type="password"
          value={verifyCode}
          onChange={handleVerifyCodeChange}
          disabled={isVerifyCodeChecked}
        />
        <SimpleBtn
          type="button"
          onClickHandler={async e =>
            await handleCheckVerifyCode({
              e,
              verifyCode,
              email,
              setIsVerifyCodeCheckLoading,
              setIsVerifyCodeChecked,
            })
          }
          disabled={isVerifyCodeChecked}
          btnName="인증번호 확인"
          style={{ backgroundColor: isVerifyCodeChecked ? 'gray' : 'white' }}
        />
        <InputBox
          label="Username"
          type="text"
          value={userName}
          onChange={handleUserNameChange}
        />
        <InputBox
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <SimpleBtn
          type="submit"
          btnName="회원가입"
          onClickHandler={async e =>
            await handleSignUpSubmit({
              e,
              email,
              password,
              userName,
              isEmailChecked,
              isVerifyCodeChecked,
              setIsSignUpLoading,
            })
          }
        />
      </form>
    </S.PageWrapper>
  );
};

export default Signup;
