import React, { useEffect } from 'react';
import { NavBar } from '../../components';
import * as S from '../../styles/common';
import styled from 'styled-components';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <NavBar />
      <S.PageWrapper>
        <Section>
          <SectionTitle>0. 임시 텍스트</SectionTitle>
          <Text>
            개발 중에 넣은 임시 텍스트입니다. 정식 테스트 입력 후 해당 섹션은
            삭제됩니다.
          </Text>
        </Section>
        <Section>
          <SectionTitle>1. 개인정보의 수집 및 이용 목적</SectionTitle>
          <Text>
            본 서비스는 다음과 같은 목적으로 개인정보를 수집 및 이용합니다:
            <ul>
              <li>서비스 제공 및 운영</li>
              <li>고객 지원 및 상담</li>
              <li>개인화된 서비스 제공</li>
            </ul>
          </Text>
        </Section>
        <Section>
          <SectionTitle>2. 수집하는 개인정보의 항목</SectionTitle>
          <Text>
            본 서비스는 회원가입 시점 그리고 서비스 이용 중에 다음과 같은
            개인정보를 수집합니다:
            <ul>
              <li>이름, 이메일 주소, 전화번호</li>
              <li>서비스 이용 기록, 접속 로그</li>
            </ul>
          </Text>
        </Section>
        <Section>
          <SectionTitle>3. 개인정보의 보유 및 이용 기간</SectionTitle>
          <Text>
            개인정보는 수집 및 이용 목적이 달성된 후에는 지체없이 파기됩니다.
            단, 법령에 따라 일정 기간 보관이 필요한 경우에는 해당 기간 동안
            보관합니다.
          </Text>
        </Section>
        <Section>
          <SectionTitle>4. 개인정보의 제3자 제공</SectionTitle>
          <Text>
            본 서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지
            않습니다. 다만, 법령의 규정에 의거하거나, 이용자의 동의를 받은
            경우에는 예외로 합니다.
          </Text>
        </Section>
        <Section>
          <SectionTitle>5. 개인정보의 안전성 확보 조치</SectionTitle>
          <Text>
            본 서비스는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
            있습니다:
            <ul>
              <li>개인정보의 암호화</li>
              <li>해킹 등에 대비한 기술적 대책</li>
            </ul>
          </Text>
        </Section>
        <Section>
          <SectionTitle>6. 개인정보 보호 책임자</SectionTitle>
          <Text>
            개인정보 보호에 관한 문의사항은 아래의 개인정보 보호 책임자에게
            연락해주시기 바랍니다:
            <ul>
              <li>이름: 홍길동</li>
              <li>이메일: privacy@example.com</li>
              <li>전화번호: 010-1234-5678</li>
            </ul>
          </Text>
        </Section>
      </S.PageWrapper>
    </>
  );
};

export default PrivacyPolicy;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  /* font-size: 1.0em; */
  margin-bottom: 10px;
`;

const Text = styled.p`
  font-size: 0.9em;
  line-height: 1.6;

  ul {
    margin-top: 10px;
    padding-left: 20px;

    li {
      list-style-type: disc;
    }
  }
`;
