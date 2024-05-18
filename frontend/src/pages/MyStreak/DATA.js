import theme from '../../styles/theme';

// =============== 데이터 Constants ===============
export const CHALLANGE_HISTORY_TEXT = {
  noHistory: '선택한 날짜의 챌린지 기록이 없습니다.',
  wakeTime: '기상 시간',
  score: '미라클 게임 결과',
  mates: '미라클 메이트',
};

// =============== 스타일 Constants ===============
const MYSTREAK_STYLE = {
  isBold: false,
  lineColor: 'gradient',
  borderRadius: theme.radius.small,
};

export const CARD_STYLES = {
  myStreak: { ...MYSTREAK_STYLE },
  myStreakChallenge: { ...MYSTREAK_STYLE },
  myStreakCalendar: { ...MYSTREAK_STYLE },
};

export const HEADER_STYLES = {
  myStreakChallenge: {
    text: '챌린지 달성 기록',
    style: {
      font: 'IBMmediumlarge',
      fontColor: 'purple',
      bgColor: 'purple',
      hasBackground: false,
      borderRadius: '20px 20px 0 0',
    },
  },
  myStreakCalendar: {
    text: '일자별 기록',
    style: {
      font: 'IBMmediumlarge',
      fontColor: 'purple',
      bgColor: 'purple',
      hasBackground: false,
      borderRadius: '20px 20px 0 0',
    },
  },
};

export const FOOTER_STYLES = {
  myStreakCalendar: {
    style: {
      bgColor: 'purple',
      borderRadius: '0 0 20px 20px',
    },
  },
};
