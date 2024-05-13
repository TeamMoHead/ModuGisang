import React from 'react';
import { Icon } from './';
import styled from 'styled-components';

const LoadingWithText = ({ loadingMSG }) => {
  const iconStyle = {
    size: 30,
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
  ${({ theme }) => theme.flex.center}
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
  ${({ theme }) => theme.fonts.JuaSmall}
  color: ${({ theme }) => theme.colors.white};
  margin-left: 10px;
`;
