import axios from 'axios';
import { TEST_CONFIG } from '../config';

const API = axios.create({
  baseURL: TEST_CONFIG.BASE_URL,
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
  return await API.get(url, config);
};

const getInvitationInfo = async ({ accessToken, userId }) => {
  const url = '/challenge/invitations';
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      guestId: userId,
    },
  };

  return await API.get(url, config);
};

const acceptInvitation = async ({ accessToken, challengeId, userId }) => {
  const url = '/challenge/acceptinvitation';
  const payload = {
    challengeId: challengeId,
    guestId: userId,
  };
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return await API.post(url, payload, config);
};

const createChallenge = async ({ accessToken, newChallengeData }) => {
  const url = '/challenge/create';
  const payload = {
    hostId: newChallengeData.hostId,
    duration: newChallengeData.duration,
    startDate: newChallengeData.startDate,
    wakeTime: newChallengeData.wakeTime,
    mates: newChallengeData.mates,
  };
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return await API.post(url, payload, config);
};

const checkMateAvailability = async ({ accessToken, email }) => {
  const url = '/challenge/searchmate';
  const config = {
    params: { email: email },
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return await API.get(url, config);
};

const getCallendarInfo = async ({ accessToken, userId, month }) => {
  const url = `/challenge/calendar/${userId}/${month}`;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return await API.get(url, config);
};

const getCallendarInfoByDate = async ({ accessToken, userId, date }) => {
  const url = `/challenge/${userId}/results/${date}`;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return await API.get(url, config);
};

const getConnectionToken = async ({ userData }) => {
  return axios.post(`https://api.modugisang.site/api/startSession`, {
    userData,
  });
};

export const challengeServices = {
  getChallengeInfo,
  createChallenge,
  checkMateAvailability,
  getInvitationInfo,
  acceptInvitation,
  getCallendarInfo,
  getCallendarInfoByDate,
  getConnectionToken,
};
