import React from 'react';
import styled from 'styled-components';

const LongBtn = ({ btnName, onClickHandler }) => {
  return (
    <Wrapper
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onClickHandler(e);
      }}
    >
      {btnName}
    </Wrapper>
  );
};

export default LongBtn;

const Wrapper = styled.button`
  width: 100%;
  height: 50px;
  padding: 10px;
  /* background-color: ${({ theme }) => theme.colors.primary.emerald}; */
  background: ${({ theme }) => theme.gradient.largerEmerald};
  border-radius: 20px;
  ${({ theme }) => theme.fonts.JuaSmall};
  color: ${({ theme }) => theme.colors.primary.white};

  cursor: pointer;
`;
