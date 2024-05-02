import React from 'react';
import styled from 'styled-components';

const SimpleBtn0 = ({ btnName, onClickHandler }) => {
  return <Wrapper onClick={onClickHandler}>{btnName}</Wrapper>;
};

export default SimpleBtn0;

const Wrapper = styled.button`
  width: 100px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.primary.emerald};
  border-radius: 5px;

  cursor: pointer;
`;
