import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  TEST_CHALLENGE_INFO,
  TEST_INVIATION_INFO,
} from '../pages/Main/TEST_DATA';
import { TEST_CONFIG } from '../config';

const API = axios.create({
  baseURL: 'http://3.38.107.25:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const mock = new MockAdapter(API);

mock.onGet('/challenge').reply(config => {
  const { challengeId } = config.params;
  const _challengeId = parseInt(challengeId);
  const challenge = TEST_CHALLENGE_INFO.find(
    c => c.challengeId === _challengeId,
  );
  if (challenge) {
    return [
      200,
      {
        challengeId: challenge.challengeId,
        startDate: challenge.startDate,
        wakeTime: challenge.wakeTime,
        mates: challenge.mates,
      },
    ];
  } else {
    return [404, { message: 'Challenge not found' }];
  }
});

mock.onGet('/challenge/invitations').reply(config => {
  const userId = config.params.userId;
  const userData = TEST_INVIATION_INFO.find(
    user => user.userId === parseInt(userId),
  );

  if (userData) {
    return [200, userData.invitations]; // 해당 userId에 맞는 invitations 반환
  } else {
    return [404, { message: 'No invitations found for this user.' }]; // 데이터 없을 경우 404 반환
  }
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
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return API.post(url, payload, config);
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
  getInvitationInfo,
  acceptInvitation,
  getConnectionToken,
};
