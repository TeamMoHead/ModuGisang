import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../../contexts';

const Affirmation = () => {
  const user = useContext(UserContext);
  return (
    <>
      <Wrapper>
        <Text>{user?.userData?.affirmation}</Text>
      </Wrapper>
    </>
  );
};

export default Affirmation;

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

const Text = styled.p`
  position: absolute;
  top: 33%;
  left: 50%;
  transform: translate(-50%, -33%);

  ${({ theme }) => theme.flex.center}
  width: 90%;
  height: 50%;
  padding: 15px;

  ${({ theme }) => theme.fonts.content}
  color:${({ theme }) => theme.colors.primary.dark};
  font-size: 2rem;
  text-align: center;

  background-color: ${({ theme }) => theme.colors.lighter.light};
  border-radius: ${({ theme }) => theme.radius.basic};
  border: 3px solid ${({ theme }) => theme.colors.lighter.purple};
`;
