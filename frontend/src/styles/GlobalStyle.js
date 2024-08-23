import { createGlobalStyle } from 'styled-components';
import backgroundImage from '../assets/backgroundImage.png';
import theme from './theme';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
${reset}

  * { 
    box-sizing: border-box;
    text-decoration: none;    
  }

  html, body {
    font-family: 'IBM Plex Sans KR', 'Noto Sans KR', 'Jua', sans-serif;
    background-image: url(${backgroundImage});
    background-size: cover;
    background-position: center;
    color: ${theme.colors.primary.white};
    overscroll-behavior: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  input,
  textarea,
  button{
    border:none;
    background: transparent;
    &:focus{
      border:none;
      outline: none;
    }
    font-size: 16px;
  }
`;

export default GlobalStyle;
