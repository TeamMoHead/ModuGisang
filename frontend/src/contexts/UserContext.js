import React, { useState, createContext, useContext, useEffect } from 'react';
import { AccountContext } from './AccountContexts';
import useFetch from '../hooks/useFetch';
import { userServices } from '../apis';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const { fetchData } = useFetch();
  const { accessToken, userId } = useContext(AccountContext);
  const [userData, setUserData] = useState({
    // userId: 1,
    // userName: '',
    // medals: {},
    // streakDays: 0,
    // challengeId: 0,
    // invitationCounts: 0,
    // affirmation: '',
  });
  const [challengeId, setChallengeId] = useState(-1);

  const getUserData = async () => {
    const response = await fetchData(() =>
      userServices.getUserInfo({ accessToken, userId }),
    );

    const { isLoading, data, error } = response;

    if (!isLoading && data) {
      setUserData(data);
      setChallengeId(data.challengeId);
    } else {
      console.error(error);
    }

    return response;
  };

  useEffect(() => {
    if (accessToken && userId) {
      getUserData();
    }
  }, [userId]);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        challengeId,
        setChallengeId,
        getUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
