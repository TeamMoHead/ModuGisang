import axios from 'axios';
import { BASE_URL } from '../config';

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getChallengeInfo = async (id = '') => {
  return API.get(`/challenge?id=${id}`);
};

const getConnectionToken = async ({ userData }) => {
  const { challengeId, userId, userName } = userData;

  console.log('get token api: ', userData);

  return axios.post(
    `http://43.203.123.240:5001/api/sessions/${challengeId}/connections`,
    userData,
  );
};

export const challengeServices = {
  getChallengeInfo,
  getConnectionToken,
};
