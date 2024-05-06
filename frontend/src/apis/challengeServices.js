import axios from 'axios';
import { TEST_CONFIG } from '../config';

const API = axios.create({
  baseURL: TEST_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getChallengeInfo = async ({ accessToken, challengeId }) => {
  console.log("API getChallengeInfo's PARAMS");
  console.log('accessToken: ', accessToken);
  console.log('challengeId: ', challengeId);
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
  console.log("API getInvitationInfo's PARAMS");
  console.log('accessToken: ', accessToken);
  console.log('userId: ', userId);
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
  console.log("API acceptInvitation's PARAMS");
  console.log('accessToken: ', accessToken);
  console.log('challengeId: ', challengeId);
  console.log('userId: ', userId);
  const url = '/challenge/acceptinvitation';
  const payload = {
    challengeId: challengeId,
    guestId: userId,
  };
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return API.post(url, payload, config);
};

const createChallenge = async ({ accessToken, newChallengeData }) => {
  console.log("API createChallenge's PARAMS");
  console.log('accessToken: ', accessToken);
  console.log('newChallengeData: ', newChallengeData);
  const url = '/challenge/create';
  const payload = {
    hostId: newChallengeData.hostId,
    duration: newChallengeData.duration,
    startDate: newChallengeData.startDate,
    wakeTime: newChallengeData.wakeTime,
    miracleMates: newChallengeData.miracleMates,
  };
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return API.post(url, payload, config);
};

const checkMateAvailability = async ({ accessToken, email }) => {
  console.log("API checkMateAvailability's PARAMS");
  console.log('accessToken: ', accessToken);
  console.log('email: ', email);
  const url = '/challenge/searchmate';
  const config = {
    params: { email: email },
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return await API.get(url, config);
};

const getCallendarInfo = async ({ accessToken, userId, month }) => {
  console.log("API getCallendarInfo's PARAMS");
  console.log('accessToken: ', accessToken);
  console.log('userId: ', userId);
  const url = `/challenge/calendar/${userId}/${month}`;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return await API.get(url, config);
};

const getCallendarInfoByDate = async ({ accessToken, userId, date }) => {
  console.log("API getCallendarInfoByDate's PARAMS");
  console.log('accessToken: ', accessToken);
  console.log('userId: ', userId);
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
  getInvitationInfo,
  acceptInvitation,
  createChallenge,
  checkMateAvailability,
  getCallendarInfo,
  getCallendarInfoByDate,
  getConnectionToken,
};
