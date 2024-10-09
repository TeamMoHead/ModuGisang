import React from 'react';
import { useState } from 'react';
import { LoadingWithText, LongBtn, InputLine } from '../../components';

import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import * as S from '../../styles/common';

// import { CONFIGS } from '../../config';
import styled from 'styled-components';
import { onlysun } from '../../assets/icons';

const Signin = () => {
  // const { TEST_EMAIL, TEST_PASSWORD } = CONFIGS;
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
    navigate('/signUp');
  };

  const goToForgotPassword = () => {
    navigate('/forgotPassword');
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

      <InputLine
        hasIcon={true}
        type="email"
        icon="user"
        iconStyle={iconStyle}
        value={loginEmail}
        onChange={handleLoginEmailChange}
        onClickHandler={null}
      />
      <InputLine
        hasIcon={true}
        type="password"
        icon="key"
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
        {/* <LongBtn
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
        /> */}
      </>
      <AuthOptions>
        <AuthButton onClick={goToForgotPassword}>비밀번호 찾기</AuthButton>
        <Divider>|</Divider>
        <AuthButton onClick={goToSignUp}>회원가입</AuthButton>
      </AuthOptions>
    </S.PageWrapper>
  );
};

export default Signin;

const Logo = styled.img`
  width: 109px;
  height: 108px;
  margin-bottom: 30px;
`;

const TitleBox = styled.div`
  ${({ theme }) => theme.flex.center};
  flex-direction: column;
  margin-bottom: 30px;
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
  line-height: 22px;
  letter-spacing: -0.4px;
`;

const AuthOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: fixed;
  bottom: 43px;
  padding: 0 20px;
`;

const AuthButton = styled.button`
  ${({ theme }) => theme.fonts.JuaSmall};
  color: ${({ theme }) => theme.colors.neutral.lightGray};
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
`;

const Divider = styled.span`
  margin: 0 15px;
  color: ${({ theme }) => theme.colors.neutral.lightGray};
  font-size: 16px;
`;

const iconStyle = {
  size: 20,
  color: 'white',
  hoverColor: 'white',
};
