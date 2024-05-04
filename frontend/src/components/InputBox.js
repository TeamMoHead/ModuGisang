import React, { useState } from 'react';
import SimpleBtn from './SimpleBtn';
import useFetch from '../hooks/useFetch';

const InputBox = ({ label, type, value, onChange, disabled }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{ backgroundColor: disabled ? 'gray' : 'white' }}
      />
    </div>
  );
};

const UserForm = ({ onClickHandler }) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [verifyCode, setVerifyCode] = useState(false);
  const [verifyCodeChecked, setVerifyCodeChecked] = useState(false);

  const handleLoginEmailChange = e => {
    setLoginEmail(e.target.value);
  };

  const handleLoginPasswordChange = e => {
    setLoginPassword(e.target.value);
  };

  const handleEmailChange = e => {
    setEmail(e.target.value);
    setEmailChecked(false);
  };

  const handleUsernameChange = e => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  const handleCheckDuplicateEmail = async e => {
    e.preventDefault();
    if (email === '') {
      alert('이메일을 입력해주세요.');
      return;
    }
    const response = await onClickHandler.handleEmailCheck(email);
    setEmailChecked(true);
    return response;
  };

  const handleSignUpSubmit = e => {
    e.preventDefault();
    if (emailChecked && email !== '') {
      onClickHandler.handleSignUp({ email, username, password });
      console.log('Form submitted:', { email, username, password });
    } else {
      alert('이메일 중복을 확인해주세요.');
    }
  };

  const handleSignInSubmit = e => {
    e.preventDefault();
    onClickHandler.handleLogIn(loginEmail, loginPassword);
    console.log('Form submitted:', { loginEmail, loginPassword });
  };

  const handleVerifyCodeChange = e => {
    console.log('verify code changed: ', e.target.value);
    setVerifyCode(e.target.value);
  };

  const handleCheckVerifyCode = async e => {
    e.preventDefault();
    if (verifyCode === '') {
      alert('인증번호를 입력해주세요.');
      return;
    }
    if (verifyCode === undefined) {
      console.log('Verify code undefined: ', verifyCode);
      return;
    }
    const response = await onClickHandler.handleVerifyCode(verifyCode, email);
    console.log('Form submitted:', { verifyCode, email });
    setVerifyCodeChecked(true);
    return response;
  };

  return (
    <>
      <form onSubmit={handleSignInSubmit}>
        <InputBox
          label="Email"
          type="email"
          value={loginEmail}
          onChange={handleLoginEmailChange}
        />
        <InputBox
          label="Password"
          type="password"
          value={loginPassword}
          onChange={handleLoginPasswordChange}
        />
      </form>
      <SimpleBtn
        onClickHandler={() => {
          onClickHandler.handleLogIn(loginEmail, loginPassword);
        }}
        type="submit"
        btnName="로그인"
      />
      <form onSubmit={handleSignUpSubmit}>
        <InputBox
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          disabled={emailChecked}
        />
        <SimpleBtn
          onClickHandler={handleCheckDuplicateEmail}
          disabled={emailChecked}
          btnName="중복 체크"
          style={{ backgroundColor: emailChecked ? 'gray' : 'white' }}
        />

        <InputBox
          label="Code"
          type="password"
          value={verifyCode}
          onChange={handleVerifyCodeChange}
          disabled={verifyCodeChecked}
        />
        <SimpleBtn
          type="button"
          onClickHandler={handleCheckVerifyCode}
          disabled={verifyCodeChecked}
          btnName="인증번호 확인"
          style={{ backgroundColor: verifyCodeChecked ? 'gray' : 'white' }}
        />

        <InputBox
          label="Username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
        <InputBox
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button style={{ backgroundColor: 'white' }} type="submit">
          Submit
        </button>
      </form>
    </>
  );
};
export default UserForm;
