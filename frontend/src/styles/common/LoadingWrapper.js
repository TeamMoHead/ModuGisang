import styled from 'styled-components';

const LoadingWrapper = styled.div`
  width: 100vw;
  height: 100vh;

  padding: 24px;

  ${({ theme }) => theme.flex.center};
`;

export default LoadingWrapper;
