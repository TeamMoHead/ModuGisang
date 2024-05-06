import React, { useState, createContext, useContext } from 'react';
import { userServices } from '../apis/userServices';
import { AccountContext } from './AccountContexts';
import useFetch from '../hooks/useFetch';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const { accessToken, userId } = useContext(AccountContext);
  const { fetchData } = useFetch();
  // 임시 유저 정보
  const [userInfo, setUserInfo] = useState({
    userId: '',
    userName: '',
    medals: {},
    streakDays: 0,
    challengeId: '55',
    invitationCounts: 0,
    affirmation: '',
  });

  const [challengeId, setChallengeId] = useState(userInfo.challengeId);

  return (
    <UserContext.Provider
      value={{ userInfo, setUserInfo, challengeId, setChallengeId }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
