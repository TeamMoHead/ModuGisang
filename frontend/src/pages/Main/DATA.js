import theme from '../../styles/theme';

export const GREETINGS = ['안녕하세요, ', '님!'];

export const CARD_TYPES = {
  hasChallenge: ['streak', 'challenge'],
  noChallenge: ['streak', 'invitations'],
};

const MYSTREAK_STYLE = {
  isBold: true,
  lineColor: 'gradient',
  borderRadius: theme.radius.small,
};

export const CARD_STYLES = {
  streak: {
    isBold: true,
    lineColor: 'gradient',
  },
  challenge: {
    isBold: true,
    lineColor: 'purple',
  },
  invitations: { isBold: true, lineColor: 'purple' },
  myStreak: { ...MYSTREAK_STYLE },
  myStreakChallenge: { ...MYSTREAK_STYLE },
  myStreakCalendar: { ...MYSTREAK_STYLE },

  // create: { isBold: true, lineColor: 'gradient' },
  // enter: { isBold: true, lineColor: 'gradient' },
};
