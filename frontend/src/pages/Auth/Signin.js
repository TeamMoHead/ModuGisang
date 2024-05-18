import React from 'react';
import { useState } from 'react';
import { LoadingWithText, LongBtn } from '../../components';

import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import * as S from '../../styles/common';

import { CONFIGS } from '../../config';
import styled from 'styled-components';

import { onlysun } from '../../assets/icons';
import { InputBox } from '../../components';

const Signin = () => {
  const { TEST_EMAIL, TEST_PASSWORD } = CONFIGS;
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const { handleSubmitLogIn } = useAuth();
  const navigate = useNavigate();

  const handleLoginEmailChange = e => {
    setLoginEmail(e.target.value);
  };

  const handleLoginPasswordChange = e => {
    setLoginPassword(e.target.value);
  };

  const goToSignUp = () => {
    navigate('/auth/signUp');
  };

  if (isLoginLoading) {
    return (
      <S.LoadingWrapper>
        <LoadingWithText loadingMSG="로그인 중입니다 :)" />
      </S.LoadingWrapper>
    );
  }

  return (
    <S.PageWrapper>
      <TitleBox>
        <Logo src={onlysun} />
        <Title>모두기상</Title>
        <Subtitle>친구와 함께 미라클 모닝 챌린지</Subtitle>
      </TitleBox>

      <InputBox
        hasIcon={true}
        type="email"
        icon="user"
        iconStyle={iconStyle}
        value={loginEmail}
        onChange={handleLoginEmailChange}
        onClickHandler={null}
      />
      <InputBox
        hasIcon={true}
        type="password"
        icon={'key'}
        iconStyle={iconStyle}
        value={loginPassword}
        onChange={handleLoginPasswordChange}
        onClickHandler={null}
      />
      <>
        <LongBtn
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
        <LongBtn
          onClickHandler={async e => {
            e.preventDefault();
            await handleSubmitLogIn({
              e,
              loginEmail: TEST_EMAIL,
              loginPassword: TEST_PASSWORD,
              setIsLoginLoading,
            });
          }}
          type="submit"
          btnName="개발용 로그인"
        />
      </>
      <SignUp href="#" onClick={goToSignUp}>
        회원가입
      </SignUp>
    </S.PageWrapper>
  );
};

export default Signin;

const Logo = styled.img`
  width: 109px;
  height: 108px;
  margin-bottom: 15px;
`;

const TitleBox = styled.div`
  ${({ theme }) => theme.flex.center};
  flex-direction: column;
  margin-bottom: 60px;
`;

const Title = styled.div`
  ${({ theme }) => theme.fonts.JuaMedium};
  font-size: 40px;
  font-weight: 400;
  line-height: normal;

  background: ${({ theme }) => theme.gradient.largerEmerald};
  background-clip: text;
  color: transparent;
`;

const Subtitle = styled.div`
  ${({ theme }) => theme.fonts.IBMsmall};
  font-size: 16px;
  font-weight: 400;
  line-height: 22px; /* 137.5% */
  letter-spacing: -0.4px;
`;

const SignUp = styled.a`
  ${({ theme }) => theme.fonts.JuaSmall};
  color: ${({ theme }) => theme.colors.neutral.lightGray};
  text-decoration: underline;
`;

const iconStyle = {
  size: 20,
  color: 'white',
  hoverColor: 'white',
};
