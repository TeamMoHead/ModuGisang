import axios from 'axios';
import { TEST_CONFIG } from '../config';

const API = axios.create({
  baseURL: TEST_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getChallengeInfo = async (id = '') => {
  return API.get(`/challenge?id=${id}`);
};

const getConnectionToken = async ({ userData }) => {
  return axios.post(`https://api.modugisang.site/api/startSession`, {
    userData,
  });
};

export const challengeServices = {
  getChallengeInfo,
  getConnectionToken,
};
