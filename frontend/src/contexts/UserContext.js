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

  const getUserData = async ({ setIsUserInfoLoading }) => {
    setIsUserInfoLoading(true);
    const response = await fetchData(() =>
      userServices.getUserInfo({ accessToken, userId }),
    );
    const {
      isLoading: isUserDataLoading,
      data: userData,
      error: userDataError,
    } = response;
    if (!isUserDataLoading && userData) {
      console.log('userData:', userData);
      setIsUserInfoLoading(false);
    } else if (!isUserDataLoading && userDataError) {
      console.error(userDataError);
      setIsUserInfoLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ userInfo, getUserData, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
