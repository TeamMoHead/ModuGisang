import axios from 'axios';
import { TEST_CONFIG } from '../config';

const API = axios.create({
  baseURL: TEST_CONFIG.BASE_URL_SERVER,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getChallengeInfo = async ({ accessToken, challengeId }) => {
  const url = '/challenge';
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      challengeId: challengeId,
    },
  };
  return API.get(url, config);
};

const getInvitationInfo = async ({ accessToken, userId }) => {
  const url = '/challenge/invitations';
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      userId: userId,
    },
  };
  return API.get(url, config);
};

const acceptInvitation = async ({ accessToken, challengeId, userId }) => {
  const url = '/challenge/acceptinvitation/';
  const payload = {
    challengeId: challengeId,
    guestId: userId,
  };
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return API.post(url, payload, config);
};

const getConnectionToken = async ({ userData }) => {
  return axios.post(`https://api.modugisang.site/api/startSession`, {
    userData,
  });
};

export const challengeServices = {
  getChallengeInfo,
  getInvitationInfo,
  acceptInvitation,
  getConnectionToken,
};
