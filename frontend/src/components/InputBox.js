import React from 'react';
import styled from 'styled-components';
import Icon from './Icon';

const InputBox = ({
  hasIcon,
  type,
  icon,
  iconStyle,
  value,
  onChange,
  onClickHandler,
  disabled,
}) => {
  return (
    <Wrapper>
      <InviteBox
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {hasIcon ? (
        <IconBox onClick={onClickHandler}>
          <Icon icon={icon} iconStyle={iconStyle} />
        </IconBox>
      ) : null}
    </Wrapper>
  );
};

export default InputBox;

const Wrapper = styled.label`
  position: relative;
  width: 100%;
`;

const InviteBox = styled.input`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.translucent.lightNavy};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.primary.purple};
  ${({ theme }) => theme.fonts.IBMsmall};
  color: ${({ theme }) => theme.colors.primary.white};
  padding: 15px;

  &:focus {
    outline: none; // 기본 포커스 테두리 제거
    border: 1px solid ${({ theme }) => theme.colors.primary.purple}; // 포커스 시 새로운 테두리 색상 적용
    background-color: ${({ theme }) => theme.colors.translucent.white};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral.lightGray};
  }
`;

const IconBox = styled.button`
  color: white;
  position: absolute;
  top: 8px;
  right: 5px;
`;
