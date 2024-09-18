import React, { useState, useEffect } from 'react';
import { InputLine, LongBtn, NavBar } from '../../components';
import useAuth from '../../hooks/useAuth';
import useValidation from '../../hooks/useValidation';
import * as S from '../../styles/common';
import styled from 'styled-components';

const ChangePassword = () => {
  const { isValidPassword } = useValidation();
  const { handleChangePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [checkNewPassword, setCheckNewPassword] = useState('');
  const [isSamePassword, setIsSamePassword] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isChangeLoading, setIsChangeLoading] = useState(false);

  const handleCurrentPasswordChange = e => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = e => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);

    if (newPassword && !isValidPassword(newPassword)) {
      setPasswordError(
        '비밀번호는 최소 8자이며 숫자와 영문자, 특수문자를 하나씩 포함해야 합니다.',
      );
    } else {
      setPasswordError('');
    }
  };

  const handleCheckNewPasswordChange = e => {
    const newCheckPassword = e.target.value;
    setCheckNewPassword(newCheckPassword);
  };

  useEffect(() => {
    if (checkNewPassword && newPassword) {
      if (newPassword === checkNewPassword) {
        setIsSamePassword(true);
        setShowPasswordError(false);
      } else {
        setIsSamePassword(false);
        setShowPasswordError(true);
      }
    } else {
      setIsSamePassword(false);
      setShowPasswordError(false);
    }
  }, [newPassword, checkNewPassword]);

  if (isChangeLoading) {
    return <div>비밀번호 변경 중...</div>;
  }

  const isFormValid = () => {
    return isSamePassword && !passwordError && currentPassword && newPassword;
  };

  return (
    <>
      <NavBar />
      <S.PageWrapper>
        <FormSection>
          <Title>현재 비밀번호</Title>
          <InputLine
            hasIcon={false}
            type="password"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
          />
        </FormSection>
        <FormSection>
          <Title>새 비밀번호</Title>
          <InputLine
            hasIcon={false}
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          {passwordError && <ErrorText>{passwordError}</ErrorText>}
        </FormSection>
        <FormSection>
          <Title>새 비밀번호 확인</Title>
          <InputLine
            hasIcon={false}
            type="password"
            value={checkNewPassword}
            onChange={handleCheckNewPasswordChange}
          />
        </FormSection>
        {showPasswordError && (
          <WrongPassword>비밀번호가 일치하지 않습니다.</WrongPassword>
        )}

        <LongBtn
          type="submit"
          btnName="비밀번호 변경"
          onClickHandler={async e =>
            await handleChangePassword({
              e,
              currentPassword,
              newPassword,
              setIsChangeLoading,
            })
          }
          disabled={!isFormValid()}
        />
      </S.PageWrapper>
    </>
  );
};

export default ChangePassword;

const Title = styled.div`
  ${({ theme }) => theme.fonts.JuaSmall}
  ${({ theme }) => theme.flex.left}
  width: 100%;
  color: ${({ theme }) => theme.colors.primary.purple};
`;

const ErrorText = styled.div`
  width: 100%;
  ${({ theme }) => theme.fonts.IBMsamll};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.system.red};
`;

const WrongPassword = styled.div`
  width: 100%;
  ${({ theme }) => theme.fonts.IBMsamll};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.system.red};
`;

const FormSection = styled.div`
  width: 100%;
  ${({ theme }) => theme.flex.left}
  flex-direction: column;
  gap: 5px;
`;
