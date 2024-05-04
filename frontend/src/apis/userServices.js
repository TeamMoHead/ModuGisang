import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { TEST_USER_INFO } from '../pages/Main/TEST_DATA';
import { TEST_CONFIG } from '../config';

const API = axios.create({
  baseURL: TEST_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const mock = new MockAdapter(API);

mock.onGet('/user').reply(config => {
  const { userId } = config.params;
  const _userId = parseInt(userId);

  const user = TEST_USER_INFO.find(u => u.userId === _userId);

  if (user) {
    return [
      200,
      {
        userId: user.userId,
        userName: user.userName,
        streakDays: user.streakDays,
        medals: user.medals,
        hasChallenge: user.hasChallenge,
        challengeId: user.challengeId,
        invitationCounts: user.invitationCounts,
        affirmation: user.affirmation,
      },
    ];
  } else {
    return [404, { message: 'User not found' }];
  }
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
