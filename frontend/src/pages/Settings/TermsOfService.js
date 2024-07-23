import React, { useEffect } from 'react';
import { NavBar } from '../../components';
import * as S from '../../styles/common';
import styled from 'styled-components';

const TermsOfService = () => {
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
            개발 중에 넣은 임시 텍스트입니다. 정식 텍스트 입력 후 해당 섹션은
            삭제됩니다.
          </Text>
        </Section>
        <Section>
          <SectionTitle>1. 서비스 이용약관의 동의</SectionTitle>
          <Text>
            본 서비스를 이용함으로써 귀하는 본 약관에 동의하는 것으로
            간주됩니다. 약관에 동의하지 않으실 경우 서비스 이용이 불가능합니다.
          </Text>
        </Section>
        <Section>
          <SectionTitle>2. 서비스 이용</SectionTitle>
          <Text>
            귀하는 본 서비스를 개인적인 용도로만 이용할 수 있으며, 상업적인
            목적으로 이용할 수 없습니다. 또한, 서비스 이용 시 법령을 준수하고,
            타인의 권리를 침해하지 않아야 합니다.
          </Text>
        </Section>
        <Section>
          <SectionTitle>3. 계정 관리</SectionTitle>
          <Text>
            귀하는 자신의 계정을 안전하게 관리할 책임이 있습니다. 계정 정보가
            유출되거나 부정 사용된 경우, 즉시 당사에 통보해야 합니다.
          </Text>
        </Section>
        <Section>
          <SectionTitle>4. 서비스의 변경 및 중단</SectionTitle>
          <Text>
            당사는 사전 통지 없이 서비스의 내용을 변경하거나 중단할 수 있습니다.
            이러한 경우, 당사는 귀하에게 발생한 손해에 대해 책임을 지지
            않습니다.
          </Text>
        </Section>
        <Section>
          <SectionTitle>5. 사용자 콘텐츠</SectionTitle>
          <Text>
            귀하는 본 서비스에 게시한 콘텐츠에 대한 모든 책임을 집니다. 귀하는
            본 서비스에 게시하는 콘텐츠가 타인의 권리를 침해하지 않음을
            보증합니다.
          </Text>
        </Section>
        <Section>
          <SectionTitle>6. 면책 조항</SectionTitle>
          <Text>
            당사는 본 서비스 이용과 관련하여 발생하는 어떠한 직접, 간접, 부수적,
            특별, 결과적 손해에 대해 책임을 지지 않습니다.
          </Text>
        </Section>
        <Section>
          <SectionTitle>7. 법적 분쟁</SectionTitle>
          <Text>
            본 약관과 관련된 분쟁은 대한민국 법률에 따라 해결됩니다. 모든 법적
            절차는 대한민국의 관할 법원에서 진행됩니다.
          </Text>
        </Section>
        <Section>
          <SectionTitle>8. 약관의 변경</SectionTitle>
          <Text>
            당사는 사전 통지 없이 본 약관을 변경할 수 있습니다. 변경된 약관은
            서비스에 게시된 시점부터 효력을 가집니다.
          </Text>
        </Section>
        <Section>
          <SectionTitle>9. 문의</SectionTitle>
          <Text>
            약관에 관한 문의사항이 있으시면 아래 연락처로 문의해주시기 바랍니다:
            <ul>
              <li>이메일: support@example.com</li>
              <li>전화번호: 010-1234-5678</li>
            </ul>
          </Text>
        </Section>
      </S.PageWrapper>
    </>
  );
};

export default TermsOfService;

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
