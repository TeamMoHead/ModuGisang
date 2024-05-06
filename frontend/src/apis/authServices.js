import axios from 'axios';
import { TEST_CONFIG } from '../config';

const API = axios.create({
  baseURL: TEST_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const logInUser = async ({ email, password }) => {
  console.log("API logInUser's PARAMS");
  console.log('email: ', email);
  console.log('password: ', password);
  const url = '/auth/login';
  const payload = {
    email: TEST_CONFIG.TEST_EMAIL,
    password: TEST_CONFIG.TEST_PASSWORD,
  };
  return await API.post(url, payload);
};

const logOutUser = async ({ accessToken }) => {
  console.log("API logOutUser's PARAMS");
  const url = '/auth/logout';
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return await API.get(url, config);
};

const checkEmailAvailability = async ({ email }) => {
  console.log("API checkEmailAvailability's PARAMS");
  console.log('email: ', email);
  const url = '/email/check';
  const config = {
    params: {
      email: email,
    },
  };
  return await API.get(url, config);
};

const verifyAuthCode = async ({ verifyCode, email }) => {
  console.log("API verifyAuthCode's PARAMS");
  console.log('verifyCode: ', verifyCode);
  console.log('email: ', email);
  const url = '/auth';
  const config = {};
  const payload = { email: email, authNum: verifyCode };
  return await API.post(url, payload, config);
};

const signUpUser = async ({ email, password, userName }) => {
  console.log("API signUpUser's PARAMS");
  console.log('email: ', email);
  console.log('password: ', password);
  console.log('userName: ', userName);
  const url = '/user/signUp';
  const payload = {
    email: email,
    password: password,
    userName: userName,
  };
  return await API.post(url, payload);
};

const refreshAccessToken = async ({ accessToken, refreshToken }) => {
  console.log("API refreshAccessToken's PARAMS");
  console.log('accessToken: ', accessToken);
  console.log('refreshToken: ', refreshToken);
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
  return await API.post(url, payload, config);
};

export const authServices = {
  signUpUser,
  logInUser,
  logOutUser,
  checkEmailAvailability,
  verifyAuthCode,
  refreshAccessToken,
};
