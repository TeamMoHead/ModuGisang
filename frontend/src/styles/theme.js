import { css } from 'styled-components';

const colors = {
  primary: {
    light: '#F0F3FF',
    purple: '#836FFF',
    emerald: '#15F5BA',
    dark: '#202954',
  },
  lighter: {
    light: 'rgb(240, 243, 255, 0.6)',
    purple: 'rgb(131, 111, 255, 0.8)',
    emerald: 'rgb(21, 245, 186, 0.8)',
    dark: 'rgb(36, 41, 78, 0.8)',
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
  system: {
    green: '#00FF0F',
    red: '#FF008F',
    yellow: '#FFC500',
    white: '#ffffff',
    black: '#000000',
  },
};

const fonts = {
  title: css`
    font: 700 24px 'Jua';
    color: ${({ theme }) => theme.colors.primary.dark};
  `,
  button: css`
    font: 500 20px 'Jua';
  `,
  content: css`
    font: 400 16px 'Noto Sans KR';
    color: ${({ theme }) => theme.colors.primary.light};
  `,
  info: css`
    font: 300 15px 'Noto Sans KR';
    color: ${({ theme }) => theme.colors.system.green};
  `,
  warning: css`
    font: 300 15px 'Noto Sans KR';
    color: ${({ theme }) => theme.colors.system.yellow};
  `,
  error: css`
    font: 300 15px 'Noto Sans KR';
    color: ${({ theme }) => theme.colors.system.red};
  `,
};

const radius = {
  light: '15px',
  basic: '20px',
  round: '40px',
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

const boxShadow = {
  basic: '0 2px 4px 0 rgba(0, 0, 0, 0.15)',
  text: '0 2px 4px 0 rgba(255, 255, 255, 0.5)',
};

const gradient = {
  navBar: css`
    background: linear-gradient(
      to bottom,
      rgb(240, 243, 255, 0.6) 0%,
      rgb(240, 243, 255, 0.6) 30%,
      rgb(240, 243, 255, 0.6) 20%,
      rgba(255, 255, 255, 0) 100%
    );
  `,
};

const theme = {
  colors,
  fonts,
  radius,
  flex,
  boxShadow,
  gradient,
};

export default theme;
