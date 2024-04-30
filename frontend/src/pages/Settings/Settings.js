import React, { useContext, useEffect } from 'react';
import { AccountContext } from '../../contexts/AccountContexts';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
const Settings = () => {
  const { handleLogOut } = useContext(AccountContext);
  const { handleCheckAuth } = useAuth();
  const navigate = useNavigate();

  const refreshToken = localStorage.getItem('refreshToken');
  let contents = null;

  useEffect(() => {
    handleCheckAuth();
  }, [handleCheckAuth]);

  if (refreshToken === null) {
    contents = <div>Loading...</div>;
  } else {
    contents = (
      <>
        <button
          onClick={() => {
            handleLogOut();
            alert('로그아웃 되었습니다.');
            navigate('/auth');
          }}
        >
          Log Out
        </button>
        <div>Settings</div>
      </>
    );
  }
  return <>{contents}</>;
};

export default Settings;
