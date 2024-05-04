import React, { useState, createContext, useContext, useEffect } from 'react';
import { userServices } from '../apis/userServices';
import { AccountContext } from './AccountContexts';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
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
  const [userId, setUserId] = useState(null);
  const { accessToken } = useContext(AccountContext);

  const fetchUserData = async ({ accessToken, userId }) => {
    try {
      const response = await userServices.getUserInfo({
        accessToken: accessToken,
        userId: userId,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <UserContext.Provider
      value={{ userInfo, fetchUserData, setUserInfo, userId, setUserId }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
