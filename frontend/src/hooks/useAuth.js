import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authServices, userServices } from '../apis';
import { AccountContext } from '../contexts/AccountContexts';
import useFetch from '../hooks/useFetch';

const useAuth = () => {
  const navigate = useNavigate();

  const { fetchData } = useFetch();
  const { accessToken, setAccessToken, setUserId } = useContext(AccountContext);

  const refreshToken = localStorage.getItem('refreshToken');

  const refreshAuthorization = async () => {
    if (!refreshToken) {
      return false;
    }
    const response = await fetchData(() =>
      authServices.refreshAccessToken({
        accseeToken: accessToken,
        refreshToken: refreshToken,
      }),
    );
    const { isLoading, status, data, error } = response;

    if (!isLoading && status === 201) {
      setAccessToken(data.accessToken);
      setUserId(data.userId);
      return true;
    }

    if (!isLoading && error) {
      console.error(
        'Failed to refresh access token',
        'status: ',
        status,
        'error: ',
        error,
      );
      return false;
    }
  };

  const checkAuth = async () => {
    if (accessToken === null) {
      const isRefreshed = await refreshAuthorization();
      if (!isRefreshed) {
        alert('로그인이 필요합니다.');
        navigate('/signIn');
      }
      return isRefreshed;
    }
    return true;
  };

  const handleCheckEmail = async ({
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

  const handleSubmitSignUp = async ({
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
      navigate('/signIn');
    } else if (!isSignUpLoading && signUpError) {
      setIsSignUpLoading(false);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleSubmitLogIn = async ({
    loginEmail,
    loginPassword,
    setIsLoginLoading,
  }) => {
    if (loginEmail === '' || loginPassword === '') {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }
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

  const handleSubmitLogout = async ({ setIsLogoutLoading, userId }) => {
    setIsLogoutLoading(true);
    const response = await fetchData(() =>
      authServices.logOutUser({ accessToken, userId }),
    );
    const { isLoading: isLogoutLoading, error: logoutError } = response;
    if (!isLogoutLoading) {
      setUserId(null);
      setAccessToken(null);
      setIsLogoutLoading(false);
      localStorage.removeItem('refreshToken');
      alert('로그아웃 되었습니다.');
      navigate('/signIn');
    } else if (logoutError) {
      setIsLogoutLoading(false);
      alert(logoutError);
    }
  };

  const handleSendTmpPassword = async ({
    email,
    setIsPasswordResetLoading,
  }) => {
    if (email === '') {
      throw new Error('이메일을 입력해주세요.');
    }

    setIsPasswordResetLoading(true);

    const response = await fetchData(() =>
      authServices.sendTmpPassword({ email }),
    );

    const {
      isLoading: isPasswordResetLoading,
      status: passwordResetStatus,
      data: passwordResetData,
      error: passwordResetError,
    } = response;

    if (!isPasswordResetLoading && passwordResetData) {
      setIsPasswordResetLoading(false);
      return '임시 비밀번호가 이메일로 전송되었습니다.';
    } else if (!isPasswordResetLoading && passwordResetError) {
      setIsPasswordResetLoading(false);

      if (passwordResetStatus === 404) {
        throw new Error('가입되지 않은 이메일입니다.');
      } else {
        throw new Error(
          `임시 비밀번호 발송에 실패했습니다. ${passwordResetError}`,
        );
      }
    }
  };

  const handleChangePassword = async ({
    e,
    currentPassword,
    newPassword,
    setIsChangeLoading,
  }) => {
    e.preventDefault();

    setIsChangeLoading(true);

    const passwordChangeResponse = await fetchData(() =>
      userServices.changePassword({
        accessToken,
        newPassword,
        currentPassword,
      }),
    );

    const {
      isLoading: isPasswordChangeLoading,
      status: passwordChangeStatus,
      data: passwordChangeData,
      error: passwordChangeError,
    } = passwordChangeResponse;

    if (!isPasswordChangeLoading && passwordChangeData) {
      setIsChangeLoading(false);
      alert('비밀번호 변경에 성공했습니다.');
      navigate('/settings');
    } else if (!isPasswordChangeLoading && passwordChangeError) {
      setIsChangeLoading(false);
      if (passwordChangeStatus === 401) {
        alert('현재 비밀번호가 일치하지 않습니다. 다시 시도해주세요.');
      } else if (passwordChangeStatus === 404) {
        alert('가입하지 않은 회원입니다. 고객센터에 문의해주세요.');
      } else if (passwordChangeStatus === 400) {
        alert('비밀번호 양식이 틀렸습니다. 다시 시도해주세요.');
      } else {
        alert(`비밀번호 변경에 실패했습니다. ${passwordChangeError}`);
      }
    }
  };

  return {
    refreshAuthorization,
    checkAuth,
    handleCheckEmail,
    handleCheckVerifyCode,
    handleSubmitSignUp,
    handleSubmitLogIn,
    handleSubmitLogout,
    handleSendTmpPassword,
    handleChangePassword,
  };
};

export default useAuth;
