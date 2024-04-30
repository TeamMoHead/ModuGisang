import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
import { TEST_CONFIG } from '../config';

const API = axios.create({
  baseURL: TEST_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// MockAdapter를 사용하여 가짜 응답 생성 - npm install axios-mock-adapter 필요!!
// const mock = new MockAdapter(API);

// authToken 테스트용 응답
// mock.onGet('/auth/authenticate').reply(config => {
//   const authToken = config.headers.Authorization;
//   if (authToken === 'Bearer fake-access-token') {
//     return [200, { isValid: true }];
//   } else {
//     return [401, { isValid: false }];
//   }
// });

// // logIn 테스트용 응답
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

// mock.onPost('/auth/refresh').reply(config => {
//   const header = config.headers.Authorization;
//   const body = JSON.parse(config.data);

//   if (body.refreshToken === 'fake-refresh-token') {
//     return [200, { accessToken: 'fake-access-token' }];
//   }
//   return [401, { message: 'Invalid refresh token' }];
// });

// // logOut 테스트용 응답
// mock.onGet('/user/logout').reply(200, {
//   message: 'Logged out',
// });

const logInUser = async (email, password) => {
  return API.post('/user/login', { email: email, password: password });
};

// login 시간 지연 테스트용 코드
// const logInUser = async (email, password) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve({
//         data: {
//           accessToken: 'fake-access-token',
//           refreshToken: 'fake-refresh-token',
//         },
//       });
//     }, 1000);
//   });
// };

const logOutUser = async accessToken => {
  return API.get('/user/logout', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const signUpUser = async (email, password, name) => {
  return API.post('/user/signUp', {
    email: email,
    password: password,
    name: name,
  });
};

const checkEmailAvailability = async email => {
  return API.get('/email/check', { params: { email } });
};

const verifyAuthCode = async authNum => {
  return API.post('/auth', { authNum });
};

const verifyAccessToken = async accessToken => {
  return API.get('/auth/authenticate', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const refreshAccessToken = async (accessToken, refreshToken) => {
  return API.post(
    '/auth/refresh',
    { refreshToken: refreshToken },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
};

export const authServices = {
  signUpUser,
  logInUser,
  logOutUser,
  checkEmailAvailability,
  verifyAuthCode,
  verifyAccessToken,
  refreshAccessToken,
};
