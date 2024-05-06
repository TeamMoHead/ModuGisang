import React, { useState, createContext } from 'react';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    // userId: 1,
    // userName: '',
    // medals: {},
    // streakDays: 0,
    // challengeId: 55,
    // invitationCounts: 0,
    // affirmation: '',
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
