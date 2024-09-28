import axios from 'axios';
import { CONFIGS } from '../config';

const API = axios.create({
  baseURL: CONFIGS.BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const logInUser = async ({ email, password }) => {
  const url = '/auth/login';
  const payload = {
    email,
    password,
  };
  return await API.post(url, payload);
};

const logOutUser = async ({ accessToken, userId }) => {
  const url = `/auth/logout/${userId}`;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return await API.get(url, config);
};

const checkEmailAvailability = async ({ email }) => {
  const url = '/email/check';
  const config = {
    params: {
      email: email,
    },
  };
  return await API.get(url, config);
};

const verifyAuthCode = async ({ verifyCode, email }) => {
  const url = '/auth';
  const config = {};
  const payload = { email: email, authNum: verifyCode };
  return await API.post(url, payload, config);
};

const signUpUser = async ({ email, password, userName }) => {
  const url = '/user/sign-up';
  const payload = {
    email: email,
    password: password,
    userName: userName,
  };
  return await API.post(url, payload);
};

const deleteUser = async ({ accessToken, password }) => {
  const url = `/user/delete-user`;
  const payload = {
    password,
  };
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return await API.post(url, payload, config);
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
  return await API.post(url, payload, config);
};

export const authServices = {
  signUpUser,
  deleteUser,
  logInUser,
  logOutUser,
  checkEmailAvailability,
  verifyAuthCode,
  refreshAccessToken,
};
