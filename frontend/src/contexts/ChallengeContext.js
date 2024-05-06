import React, { createContext, useContext, useState } from 'react';
import { AccountContext, UserContext } from './';
import { challengeServices } from '../apis/challengeServices';

const ChallengeContext = createContext();

const ChallengeContextProvider = ({ children }) => {
  const { accessToken, userId } = useContext(AccountContext);
  const { userInfo } = useContext(UserContext);
  const { challengeId } = userInfo;
  // 임시 데이터
  const [challengeData, setChallengeData] = useState({
    challengeId: '55',
    startDate: '2021-09-01T00:00:00.000Z',
    wakeTime: '12:20',
    mates: [
      { userId: 1, userName: '천사박경원' },
      { userId: 2, userName: '귀요미이시현' },
      { userId: 3, userName: '깜찍이이재원' },
      { userId: 4, userName: '상큼이금도현' },
      { userId: 5, userName: '똑똑이연선애' },
    ],
  });

  const fetchChallengeData = async () => {
    try {
      const response = await challengeServices.getChallengeInfo({
        accessToken: accessToken,
        challengeId: challengeId,
      });
      if (response.data) {
        return response;
      } else {
        console.error('No challenge data received');
      }
    } catch (error) {
      console.error('Failed to fetch challenge data:', error);
    }
  };

  const fetchInvitationData = async () => {
    try {
      const response = await challengeServices.getInvitationInfo({
        accessToken,
        userId,
      });
      if (response.data) {
        return response;
      } else {
        console.error('No invitation data received');
      }
    } catch (error) {
      console.error('Failed to fetch invitation data:', error);
    }
  };

  return (
    <ChallengeContext.Provider
      value={{
        challengeData,
        fetchChallengeData,
        fetchInvitationData,
        setChallengeData,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export { ChallengeContext, ChallengeContextProvider };
