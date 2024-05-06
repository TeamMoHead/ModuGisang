export const TEST_USER_INFO = [
  {
    userId: 1,
    userEmail: 'aaa@aaa.com',
    userPassword: '1234',
    userName: '천사박경원',
    accessToken: 'accessToken0',
    refreshToken: 'refreshToken0',
    streakDays: 51,
    medals: { gold: 11, silver: 11, bronze: 33 },
    challengeId: 333,
    invitationCounts: 0,
    affirmation: '시간은 금이다',
  },
  {
    userId: 2,
    userEmail: 'bbb@bbb.com',
    userPassword: '1234',
    userName: '귀요미이시현',
    accessToken: 'accessToken1',
    refreshToken: 'refreshToken1',
    streakDays: 1314,
    medals: { gold: 0, silver: 0, bronze: 0 },
    challengeId: null,
    invitationCounts: 4,
    affirmation: '내가 제일 귀여워!',
  },
  {
    userId: 3,
    userEmail: 'ccc@ccc.com',
    userPassword: '1234',
    userName: '깜찍이이재원',
    accessToken: 'accessToken2',
    refreshToken: 'refreshToken2',
    streakDays: 3332,
    medals: { gold: 55, silver: 2, bronze: 55 },
    challengeId: null,
    invitationCounts: 4,
    affirmation: 'I am the best!',
  },
  {
    userId: 4,
    userEmail: 'ddd@ddd.com',
    userPassword: '1234',
    userName: '상큼이금도현',
    accessToken: 'accessToken3',
    refreshToken: 'refreshToken3',
    streakDays: 99,
    medals: { gold: 23, silver: 23, bronze: 55 },
    challengeId: 333,
    invitationCounts: 0,
    affirmation: 'I am king!',
  },
  {
    userId: 5,
    userEmail: 'eee@eee.com',
    userPassword: '1234',
    userName: '똑똑이연선애',
    accessToken: 'accessToken4',
    refreshToken: 'refreshToken4',
    streakDays: 999,
    medals: { gold: 9, silver: 9, bronze: 9 },
    challengeId: 333,
    invitationCounts: 5,
    affirmation: 'I am media pipe master!',
  },
];

export const TEST_CHALLENGE_INFO = [
  {
    challengeId: 333,
    startDate: '2021-09-01T00:00:00.000Z',
    wakeTime: '01:14',
    duration: 7,
    mates: [
      { userId: 1, userName: '천사뿅뿅뿅' },
      { userId: 2, userName: '귀요미이시현' },
      { userId: 3, userName: '깜찍이이재원' },
      { userId: 4, userName: '상큼이금도현' },
      { userId: 5, userName: '똑똑이연선애' },
    ],
  },
];

export const TEST_INVIATION_INFO = [
  {
    userId: 0,
    invitations: [
      {
        challengeId: 9999,
        startDate: '2024-09-01T00:00:00.000Z',
        wakeTime: '07:00',
        duration: 7,
        isExpired: false,
        userName: '천사박경원',
        sendDate: '2024-08-01T00:00:00.000Z',
      },
      {
        challengeId: 8888,
        startDate: '2024-05-25T00:00:00.000Z',
        wakeTime: '10:00',
        duration: 7,
        isExpired: false,
        userName: '귀요미이시현',
        sendDate: '2024-05-01T00:00:00.000Z',
      },
    ],
  },
  {
    userId: 1,
    invitations: [
      {
        challengeId: 7777,
        startDate: '2024-06-15T00:00:00.000Z',
        wakeTime: '06:30',
        duration: 7,
        isExpired: false,
        userName: '운동하는호랑이',
        sendDate: '2024-06-01T00:00:00.000Z',
      },
      {
        challengeId: 6666,
        startDate: '2024-08-10T00:00:00.000Z',
        wakeTime: '09:00',
        duration: 7,
        isExpired: false,
        userName: '건강한몸',
        sendDate: '2024-08-01T00:00:00.000Z',
      },
    ],
  },
  {
    userId: 2,
    invitations: [
      {
        challengeId: 5555,
        startDate: '2024-07-05T00:00:00.000Z',
        wakeTime: '07:00',
        duration: 7,
        isExpired: false,
        userName: '행복한하루',
        sendDate: '2024-07-01T00:00:00.000Z',
      },
      {
        challengeId: 4444,
        startDate: '2024-09-20T00:00:00.000Z',
        wakeTime: '08:30',
        duration: 7,
        isExpired: false,
        userName: '즐거운운동',
        sendDate: '2024-09-01T00:00:00.000Z',
      },
    ],
  },
  {
    userId: 3,
    invitations: [
      {
        challengeId: 3333,
        startDate: '2024-05-20T00:00:00.000Z',
        wakeTime: '07:30',
        duration: 7,
        isExpired: false,
        userName: '행복한나날',
        sendDate: '2024-05-01T00:00:00.000Z',
      },
    ],
  },
  {
    userId: 4,
    invitations: [
      {
        challengeId: 2222,
        startDate: '2024-08-05T00:00:00.000Z',
        wakeTime: '08:00',
        duration: 7,
        isExpired: false,
        userName: '신나는청춘',
        sendDate: '2024-08-01T00:00:00.000Z',
      },
      {
        challengeId: 1111,
        startDate: '2024-09-10T00:00:00.000Z',
        wakeTime: '06:45',
        duration: 7,
        isExpired: false,
        userName: '열정적인운동가',
        sendDate: '2024-09-01T00:00:00.000Z',
      },
    ],
  },
];
