import React, { useContext, useEffect, useState } from 'react';

import { UserContext } from '../../../contexts';
import styled from 'styled-components';

import { LoadingWithText } from '../../../components';

const InvitationsContent = () => {
  const { myData } = useContext(UserContext);
  const { invitationCounts } = myData;
  const [isInvitationsLoading, setIsInvitationsLoading] = useState(true);

  console.log('invitationCounts:', invitationCounts);

  useEffect(() => {
    if (invitationCounts !== undefined) {
      setIsInvitationsLoading(false);
    }
  }, [invitationCounts]);

  return isInvitationsLoading ? (
    <Wrapper>
      <LoadingWrapper>
        <LoadingWithText />
      </LoadingWrapper>
    </Wrapper>
  ) : (
    <Wrapper>
      <>
        <InviteCount>{invitationCounts}</InviteCount>
        <InvitationTitle>초대받은 챌린지</InvitationTitle>
        <SmallLetter>
          미라클 메이트
          <WaitInviteSpan>{invitationCounts}팀</WaitInviteSpan>이 기다리고
          있어요
        </SmallLetter>
      </>
    </Wrapper>
  );
};

export default InvitationsContent;

const Wrapper = styled.div`
  width: 100%;
  height: 140px;
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 140px;
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
`;

const InvitationTitle = styled.span`
  /* flex: ${({ theme }) => theme.flex.center}; // 추가 */
  color: ${({ theme }) => theme.colors.primary.purple};
  justify-content: center;
  ${({ theme }) => theme.fonts.JuaSmall};
  height: 46.8px;
  margin-top: 30px;
`;

const SmallLetter = styled.span`
  ${({ theme }) => theme.fonts.IBMmedium};
  height: 37px;
`;

const WaitInviteSpan = styled.span`
  color: ${({ theme }) => theme.colors.primary.emerald};
  ${({ theme }) => theme.fonts.IBMmedium};
  margin-left: 5px;
`;

const InviteCount = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: ${({ theme }) => theme.colors.system.red};
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;
