import { css } from 'styled-components';

const colors = {
  primary: {
    light: '#F0F3FF',
    main: '#836FFF',
    dark: '#211951',
  },
  secondary: {
    main: '#15F5BA',
  },
  neutral: {
    light: '#f5f5f5',
    main: '#e0e0e0',
    dark: '#bdbdbd',
  },
  text: {
    black: '#212121',
    gray: '#757575',
    lightGray: '#bdbdbd',
  },
  white: '#ffffff',
  black: '#000000',
};

const fonts = {
  title: css`
    font: 700 24px 'NotoSansKR';
    color: ${({ theme }) => theme.colors.white};
  `,
  button: css`
    font: 700 18px 'NotoSansKR';
  `,
  info: css`
    font: 300 15px 'NotoSansKR';
    color: ${({ theme }) => theme.colors.green};
  `,
  warning: css`
    font: 300 15px 'NotoSansKR';
    color: ${({ theme }) => theme.colors.red};
  `,
};

const radius = {
  basic: '5px',
  round: '8px',
};

const flex = {
  center: css`
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  left: css`
    display: flex;
    justify-content: flex-start;
    align-items: center;
  `,
  right: css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
  `,
  between: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
};

const theme = {
  colors,
  fonts,
  radius,
  flex,
};

export default theme;
