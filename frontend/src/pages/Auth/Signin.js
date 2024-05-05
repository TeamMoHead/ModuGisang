import React from 'react';
import { useState } from 'react';
import { InputBox, SimpleBtn } from '../../components';

import useAuth from '../../hooks/useAuth';

import * as S from '../../styles/common';

const Signin = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const { handleSubmitLogIn } = useAuth();

  const handleLoginEmailChange = e => {
    setLoginEmail(e.target.value);
  };

  const handleLoginPasswordChange = e => {
    setLoginPassword(e.target.value);
  };

  if (isLoginLoading) {
    return <div>로그인 중...</div>;
  }

  return (
    <S.PageWrapper>
      로그인
      <>
        <form>
          <InputBox
            label="Email"
            type="email"
            value={loginEmail}
            onChange={handleLoginEmailChange}
          />
          <InputBox
            label="Password"
            type="password"
            value={loginPassword}
            onChange={handleLoginPasswordChange}
          />
        </form>
        <SimpleBtn
          onClickHandler={async e =>
            await handleSubmitLogIn({
              e,
              loginEmail,
              loginPassword,
              setIsLoginLoading,
            })
          }
          type="submit"
          btnName="로그인"
        />
      </>
    </S.PageWrapper>
  );
};

export default Signin;
