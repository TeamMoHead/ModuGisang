import React, { createContext, useState, useEffect } from 'react';
import { challengeServices } from '../apis/challengeServices';

const ChallengeContext = createContext();

const ChallengeContextProvider = ({ children }) => {
  // 임시 데이터
  const [challengeData, setChallengeData] = useState({
    challengeId: 1234,
    startDate: '2021-09-01T00:00:00.000Z',
    wakeTime: '23:51',
    mates: [
      { userId: 0, userName: '천사뿅뿅뿅' },
      { userId: 1, userName: '귀요미이시현' },
      { userId: 2, userName: '깜찍이이재원' },
      { userId: 3, userName: '상큼이금도현' },
      { userId: 4, userName: '똑똑이연선애' },
    ],
  });

  const getChallengeData = async challengeId => {
    // try {
    //   const response = await challengeServices.getChallengeInfo(challengeId);
    //   setChallengeData(response.data);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <ChallengeContext.Provider value={{ challengeData, getChallengeData }}>
      {children}
    </ChallengeContext.Provider>
  );
};

export { ChallengeContext, ChallengeContextProvider };
