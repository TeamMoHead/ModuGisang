import axios from 'axios';
import { TEST_CONFIG } from '../config';

const API = axios.create({
  baseURL: TEST_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getUserInfo = async ({ accessToken, userId }) => {
  console.log("API getUserInfo's PARAMS");
  console.log('accessToken: ', accessToken);
  console.log('userId: ', userId);
  const url = `/user/${userId}`;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return API.get(url, config);
};

const changeAffirmation = async ({ accessToken, affirmation, userId }) => {
  console.log("API changeAffirmation's PARAMS");
  console.log('accessToken: ', accessToken);
  console.log('affirmation: ', affirmation);
  console.log('userId: ', userId);
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
