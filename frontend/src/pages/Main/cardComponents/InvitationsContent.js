import React, { useContext } from 'react';

import { UserContext } from '../../../contexts';
import styled from 'styled-components';

const InvitationsContent = () => {
  const { myData } = useContext(UserContext);
  const { invitationCounts } = myData;
  return (
    <Wrapper>
      <div>초대장 확인하기</div>
      <RightArea>
        <SmallLetter>초대 : {invitationCounts}개</SmallLetter>
      </RightArea>
    </Wrapper>
  );
};

export default InvitationsContent;

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.between}
`;

const RightArea = styled.div`
  ${({ theme }) => theme.flex.left}
  flex-direction: column;
`;

const BigLetter = styled.span`
  font: 700 24px 'Jua';
  color: ${({ theme }) => theme.colors.primary.emerald};
`;

const SmallLetter = styled.span`
  ${({ theme }) => theme.fonts.IBMsmall}
`;
