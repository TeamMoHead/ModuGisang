import axios from 'axios';
import { TEST_CONFIG } from '../config';

const API = axios.create({
  baseURL: TEST_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const logInUser = async ({ email, password }) => {
  const url = '/auth/login';
  const payload = {
    email: TEST_CONFIG.TEST_EMAIL,
    password: TEST_CONFIG.TEST_PASSWORD,
  };
  const response = await API.post(url, payload);
  console.log(response);
  return response;
};

const logOutUser = async ({ accessToken }) => {
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
  const url = '/auth';
  const config = {};
  const payload = { email: email, authNum: verifyCode };
  const response = await API.post(url, payload, config);
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
