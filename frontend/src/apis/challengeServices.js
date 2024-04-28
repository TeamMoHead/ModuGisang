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

export const challengeServices = {
  getChallengeInfo,
};
