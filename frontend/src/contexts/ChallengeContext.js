import React, { createContext, useContext, useState } from 'react';
import { AccountContext, UserContext } from './';
import { challengeServices } from '../apis/challengeServices';
import useFetch from '../hooks/useFetch';

const ChallengeContext = createContext();

const ChallengeContextProvider = ({ children }) => {
  const { fetchData } = useFetch();

  // 임시 데이터
  const [challengeData, setChallengeData] = useState({
    challengeId: '333',
    startDate: '2021-09-01T00:00:00.000Z',
    wakeTime: '17:30',
    mates: [
      { userId: 0, userName: '천사뿅뿅뿅' },
      { userId: 1, userName: '귀요미이시현' },
      { userId: 2, userName: '깜찍이이재원' },
      { userId: 3, userName: '상큼이금도현' },
      { userId: 4, userName: '똑똑이연선애' },
    ],
  });

  const getChallengeData = async challengeId => {
    // =========API 연동후 주석 풀 예정 ==========
    // try {
    //   const response = await challengeServices.getChallengeInfo(challengeId);
    //   setChallengeData(response.data);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const handleCreateChallenge = async ({
    accessToken,
    newChallengeData,
    setIsCreateChallengeLoading,
  }) => {
    setIsCreateChallengeLoading(true);
    const response = await fetchData(() =>
      challengeServices.createChallenge({
        accessToken,
        newChallengeData,
      }),
    );
    const {
      isLoading: isCreateChallengeLoading,
      data: createChallengeData,
      error: createChallengeError,
    } = response;
    if (!isCreateChallengeLoading && createChallengeData) {
      console.log('createChallengeData:', createChallengeData);
      setIsCreateChallengeLoading(false);
    } else if (!isCreateChallengeLoading && createChallengeError) {
      console.error(createChallengeError);
      setIsCreateChallengeLoading(false);
    }
  };

  const handleAcceptInvitation = async ({
    accessToken,
    inviChallengeId,
    userId,
    setIsAcceptInviLoading,
  }) => {
    setIsAcceptInviLoading(true);
    const response = await fetchData(() =>
      challengeServices.acceptInvitation({
        accessToken,
        challengeId: 17,
        userId,
      }),
    );
    const {
      isLoading: isAcceptInviLoading,
      data: acceptInviData,
      error: acceptInviError,
    } = response;
    if (!isAcceptInviLoading && acceptInviData) {
      console.log('acceptInviData:', acceptInviData);
      setIsAcceptInviLoading(false);
    } else if (!isAcceptInviLoading && acceptInviError) {
      console.error(acceptInviError);
      setIsAcceptInviLoading(false);
    }
  };

  return (
    <ChallengeContext.Provider
      value={{
        challengeData,
        setChallengeData,
        getChallengeData,
        handleCreateChallenge,
        handleAcceptInvitation,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export { ChallengeContext, ChallengeContextProvider };
