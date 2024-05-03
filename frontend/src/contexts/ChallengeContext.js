import React, { createContext, useState } from 'react';
import { challengeServices } from '../apis/challengeServices';

const ChallengeContext = createContext();

const ChallengeContextProvider = ({ children }) => {
  // 임시 데이터
  const [challengeData, setChallengeData] = useState({
    challengeId: '',
    startDate: '',
    wakeTime: '',
    mates: [],
  });

  const fetchChallengeData = async ({ accessToken, challengeId }) => {
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

  const fetchInvitationData = async ({ accessToken, userId }) => {
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

  const getChallengeData = async challengeId => {
    try {
      const response = await challengeServices.getChallengeInfo(challengeId);
      setChallengeData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ChallengeContext.Provider
      value={{
        challengeData,
        fetchChallengeData,
        fetchInvitationData,
        setChallengeData,
        getChallengeData,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export { ChallengeContext, ChallengeContextProvider };
