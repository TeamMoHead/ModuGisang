import React from 'react';
import { StyledLink } from '../../components';
import { ContentWrapper } from './components';
import { useNavigate } from 'react-router-dom';
import * as S from '../../styles/common';
import styled from 'styled-components';
import { onlysun } from '../../assets/icons';

const Signin = () => {
  const navigate = useNavigate();

  const goToMainPage = () => {
    navigate('/');
  };

  return (
    <S.PageWrapper>
      <TitleBox>
        <Logo src={onlysun} onClick={goToMainPage} />
        <Title>모두기상</Title>
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
  cursor: pointer;
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

const AboutText = styled.div`
  line-height: 1.6;

  margin-bottom: 30px;

  p {
    margin-bottom: 1.5em;
  }
`;
