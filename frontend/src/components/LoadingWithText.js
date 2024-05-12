import React from 'react';
import { Icon } from './';
import styled from 'styled-components';

const LoadingWithText = ({ loadingMSG }) => {
  const iconStyle = {
    size: 50,
    color: 'light',
    disable: true,
  };

  return (
    <Wrapper>
      <LoadingAnimator>
        <Icon icon="loading" iconStyle={iconStyle} />
      </LoadingAnimator>
      <Text>{loadingMSG}</Text>
    </Wrapper>
  );
};

export default LoadingWithText;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  ${({ theme }) => theme.flex.center}/* margin: auto; */
`;

const LoadingAnimator = styled.div`
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Text = styled.span`
  ${({ theme }) => theme.fonts.JuaMedium}
  color: ${({ theme }) => theme.colors.white};
  margin-left: 10px;
`;
