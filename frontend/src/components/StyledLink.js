import styled from 'styled-components';

const StyledLink = styled.span`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary.purple};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default StyledLink;
