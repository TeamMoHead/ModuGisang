import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../contexts/AccountContexts';
import { authServices } from '../apis/authServices';
import { UserContext } from '../contexts/UserContext';

const useAuth = () => {
  const navigate = useNavigate();

  const { accessToken, setAccessToken } = useContext(AccountContext);
  const { setUserId } = useContext(UserContext);
  const refreshToken = localStorage.getItem('refreshToken');

  const signUpUser = async (email, password, userName) => {
    try {
      const response = await authServices.signUpUser({
        email: email,
        password: password,
        userName: userName,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '회원가입에 실패했습니다.',
      };
    }
  };

  const refreshAuthorization = async () => {
    try {
      if (!refreshToken) {
        console.log('No refresh token');
        return false;
      }
      const response = await authServices.refreshAccessToken({
        accseeToken: accessToken,
        refreshToken: refreshToken,
      });
      if (response.status === 201) {
        setAccessToken(response.data.accessToken);
        setUserId(response.data.userId);
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
    signUpUser,
    refreshAuthorization,
    handleCheckAuth,
  };
};

export default useAuth;
