import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, SimpleBtn } from '../../components';
import { ChallengeContext } from '../../contexts/ChallengeContext';
import { AccountContext } from '../../contexts/AccountContexts';
import { UserContext } from '../../contexts/UserContext';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';

import * as S from '../../styles/common';

const JoinChallenge = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [invitations, setInvitations] = useState([]);
  const [isInvitationLoading, setIsInvitationLoading] = useState(true);

  const { fetchInvitationData } = useContext(ChallengeContext);
  const { accessToken } = useContext(AccountContext);
  const { userId } = useContext(UserContext);
  const { fetchData } = useFetch();
  const { handleCheckAuth } = useAuth();

  const navigate = useNavigate();

  const checkAuthorize = async () => {
    try {
      const response = await fetchData(() => handleCheckAuth());
      const { isLoading: isAuthLoading, error: authError } = response;
      if (!isAuthLoading) {
        setIsAuthLoading(false);
        setIsAuthorized(true);
      } else if (authError) {
        setIsAuthLoading(false);
        setIsAuthorized(false);
        navigate('/auth');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getInvitations = async ({ accessToken, userId }) => {
    setIsInvitationLoading(true);
    try {
      const response = await fetchData(() =>
        fetchInvitationData({ accessToken, userId }),
      );
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
    checkAuthorize();
  }, []);

  useEffect(() => {
    if (!isAuthLoading && isAuthorized) {
      console.log('getting invitations');
      getInvitations({ accessToken, userId });
    }
  }, [isAuthLoading, isAuthorized]);

  if (isAuthLoading) return <div>Loading...</div>;
  if (!isAuthorized) return <div>Unauthorized</div>;

  return (
    <>
      <NavBar />
      <S.PageWrapper>JoinChallenge</S.PageWrapper>
    </>
  );
};

export default JoinChallenge;
