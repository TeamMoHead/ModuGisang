import React from 'react';

import { useState } from 'react';
import { InputBox, LongBtn } from '../../components';
import useAuth from '../../hooks/useAuth';
import * as S from '../../styles/common';
import styled from 'styled-components';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [isSamePassword, setIsSamePassword] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailCheckLoading, setIsEmailCheckLoading] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [isVerifyCodeChecked, setIsVerifyCodeChecked] = useState(false);
  const [isVerifyCodeCheckLoading, setIsVerifyCodeCheckLoading] =
    useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  const { handleCheckEmail, handleCheckVerifyCode, handleSubmitSignUp } =
    useAuth();

  const handleEmailChange = e => {
    setEmail(e.target.value);
    setIsEmailChecked(false);
  };

  const handleUserNameChange = e => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };
  const handleCheckPasswordChange = e => {
    if (password === e.target.value) {
      console.log('비밀번호가 일치합니다!!');
      setIsSamePassword(true);
      setShowText(false);
    } else {
      setShowText(true);
    }
    setCheckPassword(e.target.value);
  };

  const handleVerifyCodeChange = e => {
    setVerifyCode(e.target.value);
  };

  if (isSignUpLoading || isEmailCheckLoading || isVerifyCodeCheckLoading) {
    return <div>회원가입 중...</div>;
  }

  return (
    <S.PageWrapper>
      회원가입
      <Title>이메일 주소</Title>
      <EmailBox>
        <InputBox
          type="email"
          value={email}
          onChange={handleEmailChange}
          disabled={isEmailChecked}
        />
        <SmallBtn
          onClick={async e =>
            await handleCheckEmail({
              e,
              email,
              setIsEmailChecked,
              setIsEmailCheckLoading,
            })
          }
          disabled={isEmailChecked}
        >
          중복 확인
        </SmallBtn>
      </EmailBox>
      {/*  */}
      <Title>인증 코드</Title>
      <EmailBox>
        <InputBox
          type="text"
          value={verifyCode}
          onChange={handleVerifyCodeChange}
          disabled={isVerifyCodeChecked}
        />
        <SmallBtn
          onClick={async e =>
            await handleCheckVerifyCode({
              e,
              verifyCode,
              email,
              setIsVerifyCodeCheckLoading,
              setIsVerifyCodeChecked,
            })
          }
          disabled={isVerifyCodeChecked}
        >
          인증
        </SmallBtn>
      </EmailBox>
      {/*  */}
      <Title>비밀번호</Title>
      <InputBox
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
      {/*  */}
      <Title>비밀번호 확인</Title>
      <InputBox
        type="password"
        value={checkPassword}
        onChange={handleCheckPasswordChange}
      />
      {/*  */}
      {showText ? (
        <WrongPassword>비밀번호가 일치하지 않습니다.</WrongPassword>
      ) : null}
      {/*  */}
      <Title>이름</Title>
      <InputBox type="text" value={userName} onChange={handleUserNameChange} />
      {/*  */}
      <LongBtn
        type="submit"
        btnName="회원가입"
        onClickHandler={async e =>
          await handleSubmitSignUp({
            e,
            email,
            password,
            userName,
            isEmailChecked,
            isVerifyCodeChecked,
            setIsSignUpLoading,
          })
        }
        disabled={isSamePassword}
      />
      {/* <form>
        <InputBox
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          disabled={isEmailChecked}
        />
        <LongBtn
          onClickHandler={async e =>
            await handleCheckEmail({
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
        <LongBtn
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
        <LongBtn
          type="submit"
          btnName="회원가입"
          onClickHandler={async e =>
            await handleSubmitSignUp({
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
      </form> */}
    </S.PageWrapper>
  );
};

export default Signup;

const Title = styled.div`
  ${({ theme }) => theme.fonts.JuaSmall}
  ${({ theme }) => theme.flex.left}
  width:100%;
  color: ${({ theme }) => theme.colors.primary.purple};
`;

const SmallBtn = styled.button`
  width: 120px;
  height: 50px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.primary.emerald};
  background-color: ${({ theme }) => theme.colors.primary.purple};
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => theme.fonts.JuaSmall}
  font-size:20px;
  margin-left: 14px;
`;

const EmailBox = styled.div`
  width: 100%;
  ${({ theme }) => theme.flex.left}
`;

const WrongPassword = styled.div`
  width: 100%;
  ${({ theme }) => theme.fonts.IBMsamll};
  font-size: 15px;
  color: red;
`;
