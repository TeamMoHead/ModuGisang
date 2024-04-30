import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from '../../contexts/AccountContexts';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const { logOut } = useContext(AccountContext);
  const { handleCheckAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await handleCheckAuth();
      if (!result || result.error) {
        setIsAuthorized(false);
        navigate('/auth');
      } else {
        setIsAuthorized(true);
      }
    };
    fetchData();
  }, []);

  const handleLogOut = async () => {
    setIsLoading(true);
    const result = await logOut();
    if (result) {
      alert('로그아웃 되었습니다.');
      navigate('/auth');
    }
    setIsLoading(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isAuthorized === null)
    return <div>접근이 허용되지 않은 페이지입니다.</div>;

  return (
    <>
      <button onClick={handleLogOut}>Log Out</button>
      <div>Settings</div>
    </>
  );
};

export default Settings;
