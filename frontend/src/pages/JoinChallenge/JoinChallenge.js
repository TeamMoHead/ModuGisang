import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, SimpleBtn } from '../../components';
import { AccountContext, ChallengeContext } from '../../contexts';
import { challengeServices } from '../../apis';
import useFetch from '../../hooks/useFetch';

import * as S from '../../styles/common';

const JoinChallenge = () => {
  const [invitations, setInvitations] = useState([]);
  const [inviChallengeId, setInviChallengeId] = useState('');
  const [isInvitationLoading, setIsInvitationLoading] = useState(true);
  const [isAcceptInviLoading, setIsAcceptInviLoading] = useState(false);

  const { accessToken, userId } = useContext(AccountContext);
  const { handleAcceptInvitation } = useContext(ChallengeContext);
  const { fetchData } = useFetch();

  const getInvitations = async () => {
    setIsInvitationLoading(true);
    const response = await fetchData(() =>
      challengeServices.getInvitationInfo({ accessToken, userId }),
    );
    const {
      isLoading: isGetInvitationLoading,
      data: invitationData,
      error: invitationError,
    } = response;
    console.log('response:', response);
    if (!isGetInvitationLoading && invitationData) {
      if (invitationData.length > 0) {
        setInvitations(invitationData);
      } else {
        setInvitations(['초대된 챌린지가 없습니다.']);
      }
      setIsInvitationLoading(false);
    } else if (invitationError) {
      console.error(invitationError);
      setIsInvitationLoading(false);
    }
  };

  useEffect(() => {
    getInvitations();
  }, []);

  return (
    <>
      <NavBar />
      <S.PageWrapper>
        <div>
          초대 목록: <br />
          {invitations.length > 0 ? (
            invitations[0] === '초대된 챌린지가 없습니다.' ? (
              <p>{invitations[0]}</p>
            ) : (
              <ul>
                {invitations.map((invitation, index) => (
                  <li key={index}>
                    {invitation.description || '챌린지 초대'} -
                    <SimpleBtn
                      btnName="초대 수락"
                      onClickHandler={() => {
                        setInviChallengeId(invitation.challengeId);
                        handleAcceptInvitation({
                          accessToken,
                          challengeId: invitation.challengeId,
                          userId,
                          setIsAcceptInviLoading,
                        });
                      }}
                    />
                  </li>
                ))}
              </ul>
            )
          ) : (
            <p>초대 정보를 불러오는 중...</p>
          )}
        </div>
      </S.PageWrapper>
    </>
  );
};

export default JoinChallenge;
