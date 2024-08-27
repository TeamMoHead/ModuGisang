import React from 'react';
import { useState } from 'react';
import { LoadingWithText, StyledLink } from '../../components';
import { ContentWrapper } from './components';

import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import * as S from '../../styles/common';

import styled from 'styled-components';

import { onlysun } from '../../assets/icons';

const Signin = () => {
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
        {/* <Subtitle>친구와 함께 미라클 모닝 챌린지</Subtitle> */}
      </TitleBox>
      <ContentWrapper>
        <AboutText>
          <p>
            안녕하세요. 모두기상을 개발한 Team Mohead입니다. 저희의
            어플리케이션인 모두기상과 관련된 문의가 필요할 때는 하단의 이메일로
            문의주시면 감사하겠습니다.
          </p>
          <p>
            <StyledLink href="mailto:jungle4th.nmm3@gmail.com">
              jungle4th.nmm3@gmail.com
            </StyledLink>
          </p>
        </AboutText>
      </ContentWrapper>
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

const AboutText = styled.p`
  line-height: 1.6;

  margin-bottom: 30px;

  p {
    margin-bottom: 1.5em;
  }
`;
