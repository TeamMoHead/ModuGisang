import React, { useState, useContext } from 'react';
import useAuth from '../../hooks/useAuth';
import { TEST_CONFIG } from '../../config';
import { AccountContext } from '../../contexts/AccountContexts';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setAccessToken } = useContext(AccountContext);
  const { logInUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    const result = await logInUser(
      TEST_CONFIG.TEST_EMAIL,
      TEST_CONFIG.TEST_PASSWORD,
    );
    setIsLoading(false);
    if (result.success) {
      setAccessToken(result.data.accessToken);
      localStorage.setItem('refreshToken', result.data.refreshToken);
      alert('로그인 되었습니다.');
      navigate('/main');
    } else {
      alert(result.message);
      return;
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div>Auth</div>
      <button onClick={handleLogin}>로그인</button>
    </>
  );
};

export default Auth;
