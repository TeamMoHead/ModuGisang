import React, { useContext, useState, useEffect } from 'react';
import { NavBar, LongBtn, CustomRadio, InvitationCard } from '../../components';
import { AccountContext, ChallengeContext } from '../../contexts';
import { challengeServices } from '../../apis';
import useFetch from '../../hooks/useFetch';

import * as S from '../../styles/common';
import styled from 'styled-components';

const JoinChallenge = () => {
  const [invitations, setInvitations] = useState([]);
  const [isInvitationLoading, setIsInvitationLoading] = useState(true);
  const [isAcceptInviLoading, setIsAcceptInviLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const { accessToken, userId } = useContext(AccountContext);
  const { handleAcceptInvitation } = useContext(ChallengeContext);
  const { fetchData } = useFetch();

  const handleRadioChange = e => {
    setCurrentIdx(Number(e.target.value));
  };

  const cards = invitations.map((invitation, index) => ({
    label: <InvitationCard invitation={invitation} key={index} />,
    value: index,
  }));

  const getInvitations = async () => {
    setIsInvitationLoading(true);
    const response = await fetchData(() =>
      challengeServices.getInvitationInfo({ accessToken, userId }),
    );
    const { data: invitationData, error: invitationError } = response;
    if (invitationData) {
      setInvitations(invitationData);
    } else if (invitationError) {
      console.error(invitationError);
      setInvitations([]);
    }
    setIsInvitationLoading(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (invitations.length === 0) {
      alert('승낙할 수 없습니다.');
      return;
    }

    handleAcceptInvitation({
      accessToken,
      challengeId: invitations[currentIdx].challengeId,
      userId,
      setIsAcceptInviLoading,
    });
    alert(`${invitations[currentIdx].userName}의 챌린지에 참여했습니다.`);
    getInvitations();
  };

  useEffect(() => {
    getInvitations();
  }, []);

  return (
    <>
      <NavBar />
      <S.PageWrapper>
        <CustomRadio
          name="invitations"
          content={cards}
          onChange={handleRadioChange}
          selectedValue={currentIdx}
        />
        <LongBtn
          type="submit"
          btnName="초대 승낙"
          onClickHandler={handleSubmit}
        />
      </S.PageWrapper>
    </>
  );
};

export default JoinChallenge;
