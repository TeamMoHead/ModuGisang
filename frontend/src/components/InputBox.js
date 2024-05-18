import React from 'react';
import styled from 'styled-components';

const InputBox = ({ type, value, onChange, disabled }) => {
  return (
    <Input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      // style={{ backgroundColor: disabled ? 'gray' : 'white' }}
    />
  );
};

export default InputBox;

const Input = styled.input`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.translucent.lightNavy};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.primary.emerald};
  ${({ theme }) => theme.fonts.IBMsmall};
  color: ${({ theme }) => theme.colors.primary.white};
  padding: 15px;

  &:focus {
    outline: none; // 기본 포커스 테두리 제거
    border: 1px solid ${({ theme }) => theme.colors.primary.emerald}; // 포커스 시 새로운 테두리 색상 적용
    background-color: ${({ theme }) => theme.colors.translucent.white};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral.lightGray};
  }
`;
