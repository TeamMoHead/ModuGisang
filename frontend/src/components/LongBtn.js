import React from 'react';
import styled from 'styled-components';

const LongBtn = ({ btnName, onClickHandler, disabled = false }) => {
  return (
    <Wrapper
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
          onClickHandler(e);
        }
      }}
      disabled={disabled}
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
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.neutral.lightGray : theme.gradient.largerEmerald};
  border-radius: 20px;
  ${({ theme }) => theme.fonts.JuaSmall};
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.neutral.gray : theme.colors.primary.white};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`;
