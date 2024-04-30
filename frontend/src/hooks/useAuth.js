import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../contexts/AccountContexts';
import { authServices } from '../apis/authServices';

const useAuth = () => {
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useContext(AccountContext);
  const refreshToken = localStorage.getItem('refreshToken');

  const verifyToken = async () => {
    try {
      const response = await authServices.authToken(accessToken);
      return response;
    } catch (error) {
      console.error('Token verification failed', error);
      throw error;
    }
  };

  const handleLogIn = async (email, password) => {
    try {
      const response = await authServices.logInUser(email, password);
      setAccessToken(response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      navigate('/main');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      return;
    }
  };

  const refreshAuthorization = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        return false;
      }
      const response = await authServices.refreshAccessToken(
        accessToken,
        storedRefreshToken,
      );
      if (response.status === 200) {
        setAccessToken(response.data.accessToken);
        return true;
      } else {
        console.error('Failed to refresh access token', response.status);
        return false;
      }
    } catch (error) {
      console.error('Failed to refresh access token', error);
    }
  };

  const handleCheckAuth = async () => {
    try {
      if (!refreshToken) {
        alert('다시 로그인 해주세요');
        navigate('/auth');
        return;
      }
      if (accessToken === null) {
        const isRefreshed = await refreshAuthorization();
        if (!isRefreshed) {
          alert('다시 로그인 해주세요');
          navigate('/auth');
        }
        return isRefreshed;
      }
      return true;
    } catch (error) {
      console.error('Failed to check auth', error);
      return false;
    }
  };

  return {
    verifyToken,
    handleLogIn,
    refreshAuthorization,
    handleCheckAuth,
  };
};

export default useAuth;
