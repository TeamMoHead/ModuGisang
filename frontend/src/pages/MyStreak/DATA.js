import theme from '../../styles/theme';

const MYSTREAK_STYLE = {
  isBold: false,
  lineColor: 'gradient',
  borderRadius: theme.radius.small,
};

export const CARD_STYLES = {
  myStreak: { ...MYSTREAK_STYLE },
  myStreakChallenge: { ...MYSTREAK_STYLE },
  myStreakCallendar: { ...MYSTREAK_STYLE },
};

export const HEADER_STYLES = {
  myStreakChallenge: {
    text: '챌린지 달성 기록',
    style: {
      font: 'IBMlarge',
      fontColor: 'purple',
      bgColor: 'purple',
      hasBackground: false,
      borderRadius: '20px 20px 0 0',
    },
  },
  myStreakCallendar: {
    text: '일자별 기록',
    style: {
      font: 'IBMlarge',
      fontColor: 'purple',
      bgColor: 'purple',
      hasBackground: false,
      borderRadius: '20px 20px 0 0',
    },
  },
};
