import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authServices } from '../apis/authServices';
import { AccountContext } from '../contexts/AccountContexts';
import useFetch from '../hooks/useFetch';

const useAuth = () => {
  const navigate = useNavigate();

  const { fetchData } = useFetch();
  const { accessToken, setAccessToken, setUserId } = useContext(AccountContext);

  const refreshToken = localStorage.getItem('refreshToken');

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
        setAccessToken(response.data.data.accessToken);
        setUserId(response.data.data.userId);
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
    if (accessToken === null) {
      const isRefreshed = await refreshAuthorization();
      if (!isRefreshed) {
        alert('로그인이 필요합니다.');
        navigate('/auth');
      }
      return isRefreshed;
    }
    return true;
  };

  const handleEmailCheck = async ({
    e,
    email,
    setIsEmailChecked,
    setIsEmailCheckLoading,
  }) => {
    e.preventDefault();
    if (email === '') {
      alert('이메일을 입력해주세요.');
      return;
    }
    setIsEmailCheckLoading(true);
    const response = await fetchData(() =>
      authServices.checkEmailAvailability({ email }),
    );

    const {
      isLoading: isEmailCheckLoading,
      status: emailCheckStatus,
      data: emailCheckData,
      error: emailCheckError,
    } = response;
    if (!isEmailCheckLoading && emailCheckData) {
      alert('사용 가능한 이메일입니다. 전송된 인증번호를 입력해주세요.');
      setIsEmailChecked(true);
      setIsEmailCheckLoading(false);
    } else if (!isEmailCheckLoading && emailCheckError) {
      if (emailCheckStatus === 400) {
        alert('이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.');
      } else {
        alert(emailCheckError);
      }
      setIsEmailCheckLoading(false);
    }
  };

  const handleLogInSubmit = async ({
    loginEmail,
    loginPassword,
    setIsLoginLoading,
  }) => {
    // ============= ⭐️⭐️개발 끝나고 나서 풀어주기⭐️⭐️ ============
    // if (loginEmail === '' || loginPassword === '') {
    //   alert('이메일과 비밀번호를 입력해주세요.');
    //   return;
    // }
    setIsLoginLoading(true);
    const response = await fetchData(() =>
      authServices.logInUser({
        email: loginEmail,
        password: loginPassword,
      }),
    );
    const {
      isLoading: isLoginLoading,
      data: loginData,
      error: loginError,
    } = response;
    if (!isLoginLoading && loginData) {
      setAccessToken(loginData.accessToken);
      localStorage.setItem('refreshToken', loginData.refreshToken);
      setUserId(loginData.userId);
      setIsLoginLoading(false);
      alert('로그인 되었습니다.');
      navigate('/');
    } else if (!isLoginLoading && loginError) {
      setIsLoginLoading(false);
      alert(loginError);
    }
  };

  const handleCheckVerifyCode = async ({
    e,
    verifyCode,
    email,
    setIsVerifyCodeCheckLoading,
    setIsVerifyCodeChecked,
  }) => {
    e.preventDefault();
    if (verifyCode === '' || verifyCode === undefined) {
      alert('유효하지 않은 인증번호입니다.');
      return;
    }
    setIsVerifyCodeCheckLoading(true);
    const response = await fetchData(() =>
      authServices.verifyAuthCode({ verifyCode, email }),
    );
    const {
      isLoading: isVerifyCodeCheckLoading,
      status: verifyCodeStatus,
      data: verifyCodeData,
      error: verifyCodeError,
    } = response;
    if (!isVerifyCodeCheckLoading && verifyCodeData) {
      setIsVerifyCodeCheckLoading(false);
      setIsVerifyCodeChecked(true);
      alert('인증번호 확인이 완료되었습니다.');
    } else if (!isVerifyCodeCheckLoading && verifyCodeError) {
      setIsVerifyCodeCheckLoading(false);
      alert('인증번호가 올바르지 않습니다. 다시 입력해주세요.');
    }
  };

  const handleSignUpSubmit = async ({
    e,
    email,
    password,
    userName,
    isEmailChecked,
    isVerifyCodeChecked,
    setIsSignUpLoading,
  }) => {
    e.preventDefault();
    if (email === '' || password === '' || userName === '') {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (!isEmailChecked) {
      alert('이메일 중복 확인을 해주세요.');
      return;
    }
    if (!isVerifyCodeChecked) {
      alert('인증 번호 확인을 해주세요.');
    }
    setIsSignUpLoading(true);
    const response = await fetchData(() =>
      authServices.signUpUser({
        email,
        password,
        userName,
      }),
    );
    const {
      isLoading: isSignUpLoading,
      data: signUpData,
      error: signUpError,
    } = response;
    if (!isSignUpLoading && signUpData) {
      setIsSignUpLoading(false);
      alert('회원가입이 완료되었습니다.');
      navigate('/auth');
    } else if (!isSignUpLoading && signUpError) {
      setIsSignUpLoading(false);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return {
    refreshAuthorization,
    handleCheckAuth,
    handleLogInSubmit,
    handleEmailCheck,
    handleSignUpSubmit,
    handleCheckVerifyCode,
  };
};

export default useAuth;
