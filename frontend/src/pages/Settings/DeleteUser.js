import React, { useContext, useState } from 'react';
import {
  InputLine,
  LongBtn,
  NavBar,
  StyledLink,
  LoadingWithText,
} from '../../components';
import { AccountContext } from '../../contexts';
import useAuth from '../../hooks/useAuth';
import useNavigateWithState from '../../hooks/useNavigateWithState';
import useValidation from '../../hooks/useValidation';
import * as S from '../../styles/common';
import styled from 'styled-components';

const DeleteAccount = () => {
  const navigateWithState = useNavigateWithState();
  const { isValidPassword } = useValidation();
  const { handleDeleteAccount } = useAuth();
  const { userId } = useContext(AccountContext);

  const [password, setPassword] = useState('');
  const [isNoticeChecked, setIsNoticeChecked] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isDeleteUserLoading, setIsDeleteUserLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordChange = e => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword && !isValidPassword(newPassword)) {
      setPasswordError(
        '비밀번호는 최소 8자이며 숫자와 영문자, 특수문자를 하나씩 포함해야 합니다.',
      );
    } else {
      setPasswordError('');
    }
  };

  if (isDeleteUserLoading) {
    return (
      <S.LoadingWrapper>
        <LoadingWithText loadingMSG="탈퇴 처리 중..." />
      </S.LoadingWrapper>
    );
  }

  return (
    <>
      <NavBar />
      <S.PageWrapper>
        <NoticeWrapper>
          <span>
            회원 탈퇴 시 현재 참여 중인 챌린지에서 제외(첼린지 관련 안내 첨부
            예정)됩니다. 모두기상의 개인정보보호방침은{' '}
            <StyledLink
              onClick={() => navigateWithState('/privacyPolicy', 'deleteUser')}
            >
              여기
            </StyledLink>
            를 통해 확인해주세요.
          </span>
        </NoticeWrapper>
        <FormSection>
          <Title>현재 비밀번호</Title>
          <InputLine
            hasIcon={false}
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <ErrorText>{passwordError}</ErrorText>}
        </FormSection>
        <CheckboxWrapper>
          <CheckboxLabel>
            <input
              type="checkbox"
              checked={isNoticeChecked}
              onChange={e => setIsNoticeChecked(e.target.checked)}
            />
            <span>안내를 모두 확인했으며 동의합니다.</span>
          </CheckboxLabel>
        </CheckboxWrapper>
        <FormSection>
          <LongBtn
            type="submit"
            btnName="탈퇴하기"
            onClickHandler={async e =>
              await handleDeleteAccount({
                e,
                userId,
                setIsDeleteUserLoading,
              })
            }
            disabled={!password || passwordError || !isNoticeChecked}
          />
        </FormSection>
      </S.PageWrapper>
    </>
  );
};

export default DeleteAccount;

const NoticeWrapper = styled.div`
  ${({ theme }) => theme.flex.left}
  width: 100%;
  margin-bottom: 10px;
`;

const Title = styled.div`
  ${({ theme }) => theme.fonts.JuaSmall}
  ${({ theme }) => theme.flex.left}
  width: 100%;
  color: ${({ theme }) => theme.colors.primary.purple};
`;

const FormSection = styled.div`
  width: 100%;
  ${({ theme }) => theme.flex.left}
  flex-direction: column;
  gap: 5px;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.system.red};
  font-size: 1em;
`;

const CheckboxWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: left;
  flex-direction: column;
  margin-bottom: 10px;
`;

const CheckboxLabel = styled.label`
  ${({ theme }) => theme.fonts.IBMsamll};
  color: ${({ theme }) => theme.colors.neutral.black};
  cursor: pointer;

  input {
    margin-right: 8px;
  }
`;
