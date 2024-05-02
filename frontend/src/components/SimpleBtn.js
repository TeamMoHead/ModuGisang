import React from 'react';
import styled from 'styled-components';

const SimpleBtn = ({ btnName, onClickHandler }) => {
  return <Wrapper onClick={onClickHandler}>{btnName}</Wrapper>;
};

export default SimpleBtn;

const Wrapper = styled.button`
  z-index: 300;
  position: fixed;
  top: 100px;
  right: 10px;
  width: 100px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.primary.emerald};
  border-radius: 5px;

  cursor: pointer;
`;
