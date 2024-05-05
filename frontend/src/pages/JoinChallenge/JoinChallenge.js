import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, SimpleBtn } from '../../components';
import { ChallengeContext } from '../../contexts/ChallengeContext';
import useFetch from '../../hooks/useFetch';

import * as S from '../../styles/common';

const JoinChallenge = () => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [isInvitationLoading, setIsInvitationLoading] = useState(true);

  const { fetchInvitationData } = useContext(ChallengeContext);
  const { fetchData } = useFetch();

  const getInvitations = async () => {
    setIsInvitationLoading(true);
    try {
      const response = await fetchData(() => fetchInvitationData());
      const {
        isLoading: isInvitationLoading,
        data: invitationData,
        error: invitationError,
      } = response;
      console.log(response);
      if (!isInvitationLoading && invitationData) {
        console.log(invitationData);
        setInvitations(invitationData);
        setIsInvitationLoading(false);
      } else if (invitationError) {
        setIsInvitationLoading(false);
        console.error(invitationError);
        return;
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  useEffect(() => {
    getInvitations();
  }, []);

  return (
    <>
      <NavBar />
      <S.PageWrapper>JoinChallenge</S.PageWrapper>
    </>
  );
};

export default JoinChallenge;
