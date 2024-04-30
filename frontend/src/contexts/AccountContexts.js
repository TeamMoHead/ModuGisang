import React, { createContext, useState } from 'react';
import { authServices } from '../apis/authServices';

const AccountContext = createContext();

const AccountContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const { logOutUser } = authServices;

  const handleLogOut = async () => {
    try {
      const response = await logOutUser();
      if (response.status === 200) {
        setAccessToken(null);
        localStorage.removeItem('refreshToken');
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AccountContext.Provider
      value={{
        setAccessToken,
        accessToken,
        handleLogOut,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AccountContextProvider };
