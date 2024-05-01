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

  const logInUser = async (email, password) => {
    try {
      const response = await authServices.logInUser({
        email: email,
        password: password,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '로그인에 실패했습니다.',
      };
    }
  };

  const refreshAuthorization = async () => {
    try {
      if (!refreshToken) {
        return false;
      }
      const response = await authServices.refreshAccessToken({
        accseeToken: accessToken,
        refreshToken: refreshToken,
      });
      if (response.status === 200) {
        setAccessToken(response.data.accessToken);
        return true;
      } else {
        console.error('Failed to refresh access token', response.status);
        return false;
      }
    } catch (error) {
      console.error('Failed to refresh access token', error);
      return false;
    }
  };

  const handleCheckAuth = async () => {
    try {
      if (accessToken === null) {
        const isRefreshed = await refreshAuthorization();
        if (!isRefreshed) {
          alert('로그인이 필요합니다.');
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
    logInUser,
    refreshAuthorization,
    handleCheckAuth,
  };
};

export default useAuth;
