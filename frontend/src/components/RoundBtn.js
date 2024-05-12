import React from 'react';
import Icon from './Icon';
import styled, { css } from 'styled-components';

const btnStyleSample = {
  size: 24,
  disable: false,
  icon: 'back',
  iconStyle: {
    size: 24,
    color: 'purple',
    hoverColor: 'white',
  },
};

const RoundBtn = ({ btnStyle, onClickHandler }) => {
  const { icon, iconStyle } = btnStyle;

  return (
    <Wrapper
      $btnStyle={btnStyle}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();

        if (onClickHandler) {
          onClickHandler(e);
        }
      }}
    >
      <Icon icon={icon} iconStyle={iconStyle} />
    </Wrapper>
  );
};

export default RoundBtn;

const Wrapper = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.translucent.white};

  cursor: ${({ $iconStyle }) => ($iconStyle.disable ? 'default' : 'pointer')};

  ${({ $iconStyle }) =>
    $iconStyle.disable &&
    css`
      pointer-events: none;
    `}
`;
