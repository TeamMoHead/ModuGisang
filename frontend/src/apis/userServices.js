import axios from 'axios';
import { TEST_CONFIG } from '../config';

const API = axios.create({
  baseURL: TEST_CONFIG.BASE_URL_SERVER,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getUserInfo = async ({ accessToken, userId }) => {
  const url = '/user';
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { userId: userId },
  };
  return API.get(url, config);
};

const updateAffirmation = async (userId, affirmation, accessToken) => {
  const url = `/user/${userId}/updateAffir`;
  const payload = {
    affirmation: affirmation,
  };
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      userId: userId,
    },
  };
  return API.post(url, payload, config);
};

export const userServices = { getUserInfo, updateAffirmation };
