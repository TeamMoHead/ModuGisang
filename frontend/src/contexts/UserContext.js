import React, { useState, createContext } from 'react';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  // 임시 유저 정보
  const [userInfo, setUserInfo] = useState({
    userId: '',
    userName: '',
    streakDays: 0,
    challengeId: '55',
  });

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
