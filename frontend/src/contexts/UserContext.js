import React, { useState, createContext, useContext } from 'react';
import { userServices } from '../apis/userServices';
import { AccountContext } from './AccountContexts';
import useFetch from '../hooks/useFetch';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  // 임시 유저 정보
  const [userInfo, setUserInfo] = useState({
    userName: '',
    medals: {},
    streakDays: 0,
    challengeId: 55,
    invitationCounts: 0,
    affirmation: '',
  });

  const [challengeId, setChallengeId] = useState(Number(userInfo.challengeId));

  return (
    <UserContext.Provider
      value={{ userInfo, setUserInfo, challengeId, setChallengeId }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
