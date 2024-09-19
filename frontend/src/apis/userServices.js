import axios from 'axios';
import { CONFIGS } from '../config';

const API = axios.create({
  withCredentials: true,
  baseURL: CONFIGS.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getMyInfo = async ({ accessToken }) => {
  const url = `/user/me`;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return API.get(url, config);
};

const getUserInfo = async ({ accessToken, userId }) => {
  const url = `/user/${userId}`;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return API.get(url, config);
};

const changeAffirmation = async ({ accessToken, affirmation, userId }) => {
  const url = `/user/${userId}/update-affirm`;
  const payload = {
    affirmation: affirmation,
  };
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return API.post(url, payload, config);
};

const changeWakeTime = async ({
  accessToken,
  wakeTime,
  userId,
  challengeId,
}) => {
  const url = `/challenge/changeWakeTime`;
  const payload = {
    wakeTime: wakeTime,
    userId: userId,
    challengeId: Number(challengeId),
  };
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return API.post(url, payload, config);
};

const changePassword = async ({ email, newPassword }) => {
  const url = '/user/reset-password';
  const payload = { email, newPassword };
  // const config = {
  //   headers: { Authorization: `Bearer ${accessToken}` },
  // };
  return await API.post(url, payload);
};

export const userServices = {
  getMyInfo,
  getUserInfo,
  changeAffirmation,
  changeWakeTime,
  changePassword,
};
