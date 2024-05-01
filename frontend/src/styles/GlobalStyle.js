import { createGlobalStyle } from 'styled-components';
import theme from './theme';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
${reset}

  * { 
    box-sizing: border-box;
    text-decoration: none;    
  }

  body{
    font-family: 'IBM Plex Sans KR', 'Noto Sans KR', 'Jua', sans-serif;
    background-color: ${theme.colors.primary.dark};
    color: ${theme.colors.system.white};

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
  }
`;

export default GlobalStyle;
