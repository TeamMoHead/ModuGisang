import React, { useState } from 'react';
import { InputLine, LongBtn, NavBar } from '../../components';
import useAuth from '../../hooks/useAuth';
import useValidation from '../../hooks/useValidation';
import * as S from '../../styles/common';
import styled from 'styled-components';

const ForgotPassword = () => {
  const { isValidEmail } = useValidation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const { handleSendTemporaryPassword } = useAuth();

  const handleEmailChange = e => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    setEmailError('');
    setSuccessMessage('');
  };

  const handleForgotPassword = async e => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setEmailError('올바른 이메일 주소를 입력해 주세요.');
      return;
    }

    setEmailError('');
    setSuccessMessage('');

    try {
      const successMessage = await handleSendTemporaryPassword({ email });
      setSuccessMessage(successMessage);
    } catch (error) {
      setEmailError(error.message);
      setSuccessMessage('');
    }
  };

  return (
    <>
      <NavBar />
      <S.PageWrapper>
        <FormSection>
          <Title>비밀번호를 찾으려는 아이디</Title>
          <InputLine
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일을 입력하세요"
          />
        </FormSection>
        <LongBtn
          type="submit"
          btnName="임시 비밀번호 발송"
          onClickHandler={handleForgotPassword}
          disabled={!isValidEmail(email)}
        />
        {emailError && <ErrorText>{emailError}</ErrorText>}
        {successMessage && <SuccessText>{successMessage}</SuccessText>}
      </S.PageWrapper>
    </>
  );
};

export default ForgotPassword;

const Title = styled.div`
  ${({ theme }) => theme.fonts.JuaSmall};
  ${({ theme }) => theme.flex.left};
  width: 100%;
  color: ${({ theme }) => theme.colors.primary.purple};
`;

const FormSection = styled.div`
  width: 100%;
  ${({ theme }) => theme.flex.left};
  flex-direction: column;
  gap: 5px;
`;

const ErrorText = styled.div`
  width: 100%;
  ${({ theme }) => theme.fonts.IBMsamll};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.system.red};
`;

const SuccessText = styled.div`
  width: 100%;
  ${({ theme }) => theme.fonts.IBMsamll};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.system.green};
`;
