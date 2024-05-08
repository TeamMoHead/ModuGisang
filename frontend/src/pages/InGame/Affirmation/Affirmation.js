import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../../contexts';

const Affirmation = () => {
  const user = useContext(UserContext);
  return (
    <>
      <Affir>{user.userData.affirmation}</Affir>
    </>
  );
};

export default Affirmation;

const Affir = styled.div`
  position: fixed;
  top: 200px;
  width: 100%;
  height: auto;
  padding: 0 30px;
  ${({ theme }) => theme.flex.center}
  font: ${({ theme }) => theme.fonts.content};
  line-height: 1.2;
  font-size: 30px;
  /* background-color: ${({ theme }) => theme.colors.lighter.dark}; */
`;
