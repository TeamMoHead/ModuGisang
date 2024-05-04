import axios from 'axios';
import PageWrapper from '../styles/common/PageWrapper';

const API = axios.create({
  baseURL: 'http://3.38.107.25:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const logInUser = async ({ email, password }) => {
  const url = '/auth/login';
  const payload = {
    email: email,
    password: password,
  };
  const response = await API.post(url, payload);
  console.log(response);
  return response;
};

const logOutUser = async ({ accessToken }) => {
  console.log('accessToken', accessToken);
  const url = '/auth/logout';
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = await API.get(url, config);
  console.log(response);
  return response;
};

const signUpUser = async ({ email, password, userName }) => {
  const url = '/user/signUp';
  const payload = {
    email: email,
    password: password,
    userName: userName,
  };
  const response = await API.post(url, payload);
  console.log(response);
  return response;
};

const checkEmailAvailability = async ({ email }) => {
  const url = '/email/check';
  const config = {
    params: {
      email: email,
    },
  };
  const response = await API.get(url, config);
  console.log(response);
  return response;
};

const verifyAuthCode = async ({ verifyCode, email }) => {
  console.log('verifyCode', verifyCode);
  console.log('email', email);
  const url = '/auth';
  const payload = { authNum: verifyCode, email: email };
  const response = await API.post(url, payload);
  console.log(response);
  return response;
};

const refreshAccessToken = async ({ accessToken, refreshToken }) => {
  if (!accessToken) {
    accessToken = null;
  }
  const url = '/auth/refresh';
  const payload = {
    refreshToken: refreshToken,
  };
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  const response = await API.post(url, payload, config);
  console.log(response);
  return response;
};

export const authServices = {
  signUpUser,
  logInUser,
  logOutUser,
  checkEmailAvailability,
  verifyAuthCode,
  refreshAccessToken,
};
