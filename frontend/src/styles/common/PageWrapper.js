import styled from 'styled-components';

const PageWrapper = styled.div`
  ${({ theme }) => theme.flex.center}
  flex-direction: column;

  width: 96vw;

  gap: 20px;
  margin: auto;
  padding: 60px 20px 20px 20px;
`;

export default PageWrapper;
