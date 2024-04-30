import React from 'react';
import styled from 'styled-components';

const SimpleBtn = ({ btnName, onClickHandler }) => {
  return <Wrapper onClick={onClickHandler}>{btnName}</Wrapper>;
};

export default SimpleBtn;

const Wrapper = styled.button`
  width: 100px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.secondary.main};
  border-radius: 5px;
`;
