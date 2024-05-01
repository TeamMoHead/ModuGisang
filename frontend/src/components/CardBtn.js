import React from 'react';
import styled from 'styled-components';

const CardBtn = ({ content, onClickHandler, btnStyle }) => {
  const isClickable = !!onClickHandler;
  return (
    <Wrapper
      onClick={e => {
        if (!isClickable) return;

        e.preventDefault();
        e.stopPropagation();

        onClickHandler();
      }}
      $btnStyle={btnStyle}
      $isClickable={isClickable}
    >
      {content}
    </Wrapper>
  );
};

export default CardBtn;

const Wrapper = styled.div`
  flex-direction: column;
  padding: 10px 20px;
  width: 80vw;

  color: ${({ theme }) => theme.colors.system.white};

  border: 1px solid
    ${({ $btnStyle, theme }) =>
      $btnStyle
        ? theme.colors.primary[$btnStyle.bgColor]
        : theme.colors.primary.purple};

  border-radius: ${({ theme }) => theme.radius.basic};

  :hover {
    background-color: ${({ $btnStyle, $isClickable, theme }) =>
      $btnStyle && $isClickable && theme.colors.primary[$btnStyle.bgColor]};

    color: ${({ $btnStyle, $isClickable, theme }) =>
      $btnStyle && $isClickable && theme.colors.primary[$btnStyle.color]};
  }
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};
`;
