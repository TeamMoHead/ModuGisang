import React from 'react';
import styled from 'styled-components';

const SimpleBtn2 = ({ btnName, onClickHandler }) => {
  return <Wrapper onClick={onClickHandler}>{btnName}</Wrapper>;
};

export default SimpleBtn2;

const Wrapper = styled.button`
  z-index: 300;
  position: fixed;
  top: 150px;
  right: 10px;
  width: 100px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.primary.emerald};
  border-radius: 5px;

  cursor: pointer;
`;
