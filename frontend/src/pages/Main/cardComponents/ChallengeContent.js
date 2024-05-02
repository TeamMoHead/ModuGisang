import React from 'react';
import styled from 'styled-components';

const ChallengeContent = () => {
  return (
    <Wrapper>
      챌린지 완료까지
      <OneLineWrapper>
        <BigLetter>D-26 </BigLetter>
        <SmallLetter>남았습니다</SmallLetter>
      </OneLineWrapper>
      <p>기상시간: 05:30</p>
    </Wrapper>
  );
};

export default ChallengeContent;

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.center};
  align-items: flex-start;
  flex-direction: column;
  gap: 5px;
`;

const OneLineWrapper = styled.div`
  ${({ theme }) => theme.flex.center};
  gap: 5px;
`;

const BigLetter = styled.span`
  font: 700 24px 'Jua';
  color: ${({ theme }) => theme.colors.primary.emerald};
`;

const SmallLetter = styled.span`
  ${({ theme }) => theme.fonts.content}
`;
