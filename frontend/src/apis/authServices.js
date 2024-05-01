import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { TEST_CONFIG } from '../config';

const API = axios.create({
  baseURL: TEST_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// MockAdapter를 사용하여 가짜 응답 생성
// npm install axios-mock-adapter 필요!!
const mock = new MockAdapter(API);

// authToken 테스트용 응답
mock.onGet('/auth/authenticate').reply(config => {
  const authToken = config.headers.Authorization;
  if (authToken === 'Bearer fake-access-token') {
    return [200, { isValid: true }];
  } else {
    return [401, { isValid: false }];
  }
});

// // logIn 테스트용 응답 - 시간 지연 없음
// mock.onPost('/user/login').reply(config => {
//   const { email, password } = JSON.parse(config.data);
//   if (email === 'example@example.com' && password === 'password123') {
//     return [
//       201,
//       {
//         accessToken: 'fake-access-token',
//         refreshToken: 'fake-refresh-token',
//       },
//     ];
//   } else {
//     return [401, { message: 'Invalid email or password' }];
//   }
// });

// logIn 테스트용 응답 - 시간 지연
mock.onPost('/user/login').reply(config => {
  const { email, password } = JSON.parse(config.data);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'example@example.com' && password === 'password123') {
        resolve([
          201,
          {
            accessToken: 'fake-access-token',
            refreshToken: 'fake-refresh-token',
          },
        ]);
      } else {
        reject([
          401,
          {
            message: 'Invalid email or password',
          },
        ]);
      }
    }, 1000);
  });
});

mock.onPost('/auth/refresh').reply(config => {
  const body = JSON.parse(config.data);

  return new Promise((resolve, reject) => {
    if (body.refreshToken === 'fake-refresh-token') {
      resolve([200, { accessToken: 'fake-access-token' }]);
    }
    const error = new Error('Invalid refresh token');
    error.status = 401;
    reject(error);
  });
});

// logOut 테스트용 응답
mock.onGet('/user/logout').reply(200, {
  message: 'Logged out',
});

// logOut 테스트용 응답 - 시간 지연
mock.onGet('/user/logout').reply(config => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        200,
        {
          message: 'Logged out',
        },
      ]);
      reject([
        401,
        {
          message: 'Failed to log out',
        },
      ]);
    }, 2000);
  });
});

const logInUser = async ({ email, password }) => {
  return API.post('/user/login', { email: email, password: password });
};

const testAPI = async ({ email, password }) => {
  return axios.post('http://3.36.88.196:3000/users', {
    username: 'leejaewon babo',
    password: 'iloveyou',
  });
};

const logOutUser = async ({ accessToken }) => {
  return API.get('/user/logout', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const signUpUser = async ({ email, password, name }) => {
  return API.post('/user/signUp', {
    email: email,
    password: password,
    name: name,
  });
};

const checkEmailAvailability = async ({ email }) => {
  return API.get('/email/check', { params: { email } });
};

const verifyAuthCode = async ({ authNum }) => {
  return API.post('/auth', { authNum: authNum });
};

const verifyAccessToken = async ({ accessToken }) => {
  return API.get('/auth/authenticate', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const refreshAccessToken = async ({ accessToken, refreshToken }) => {
  return API.post(
    '/auth/refresh',
    { refreshToken: refreshToken },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
};

export const authServices = {
  testAPI,
  signUpUser,
  logInUser,
  logOutUser,
  checkEmailAvailability,
  verifyAuthCode,
  verifyAccessToken,
  refreshAccessToken,
};
