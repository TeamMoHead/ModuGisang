import React from 'react';
import styled from 'styled-components';

const InputBox = ({ value, onChange, disabled }) => {
  return (
    <InputText
      value={value}
      onChange={onChange}
      disabled={disabled}
      cols="10"
      rows="5"
    />
  );
};

export default InputBox;

const InputText = styled.textarea`
  width: 90%;
  height: 100%;
  ${({ theme }) => theme.flex.center};
  color: ${({ theme }) => theme.colors.primary.white};
  z-index: 100;
  ${({ theme }) => theme.fonts.IBMlarge};
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  resize: none;
`;
