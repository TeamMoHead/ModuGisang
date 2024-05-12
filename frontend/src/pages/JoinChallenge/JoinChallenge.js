import React, { useContext, useState, useEffect } from 'react';
import { NavBar, LongBtn } from '../../components';
import { AccountContext, ChallengeContext } from '../../contexts';
import { challengeServices } from '../../apis';
import useFetch from '../../hooks/useFetch';

import * as S from '../../styles/common';

const JoinChallenge = () => {
  const [invitations, setInvitations] = useState([]);
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
    const { data: invitationData, error: invitationError } = response;
    if (invitationData) {
      setInvitations(invitationData);
    } else if (invitationError) {
      console.error(invitationError);
      setInvitations([]);
    }
    setIsInvitationLoading(false);
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
            <ul>
              {invitations.map(invitation => (
                <li key={invitation.challengeId}>
                  {'초대자: ' + invitation.userName}
                  <br />
                  <br />
                  {'챌린지 기간: ' + invitation.duration + '일'}
                  <br />
                  <br />
                  {'시작일: ' +
                    new Date(invitation.startDate).toLocaleDateString()}
                  <br />
                  <br />
                  {'초대 받은 날짜: ' +
                    new Date(invitation.sendDate).toLocaleDateString()}
                  <br />
                  <br />
                  <LongBtn
                    key={invitation.challengeId}
                    btnName="초대 수락"
                    onClickHandler={() => {
                      handleAcceptInvitation({
                        accessToken,
                        challengeId: invitation.challengeId,
                        userId,
                        setIsAcceptInviLoading,
                      });
                      alert(`${invitation.userName}의 챌린지에 참여했습니다.`);
                      getInvitations();
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>초대된 챌린지가 없습니다.</p>
          )}
        </div>
      </S.PageWrapper>
    </>
  );
};

export default JoinChallenge;
