import axios from 'axios';
import { CONFIGS } from '../config';

const API = axios.create({
  baseURL: CONFIGS.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getUserInfo = async ({ accessToken, userId }) => {
  const url = `/user/${userId}`;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return API.get(url, config);
};

const changeAffirmation = async ({ accessToken, affirmation, userId }) => {
  const url = `/user/${userId}/updateAffirm`;
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

export const userServices = { getUserInfo, changeAffirmation };
