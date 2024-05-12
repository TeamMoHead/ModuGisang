import React from 'react';
import styled from 'styled-components';

const boxStyleSample = {
  bgColor: 'purple',
  lineColor: 'white',
};

const OutlineBox = ({ content, onClickHandler, boxStyle }) => {
  const isClickable = !!onClickHandler;
  return (
    <Wrapper
      onClick={e => {
        if (!isClickable) return;

        e.preventDefault();
        e.stopPropagation();

        onClickHandler();
      }}
      $boxStyle={boxStyle}
      $isClickable={isClickable}
    >
      {content}
    </Wrapper>
  );
};

export default OutlineBox;

const Wrapper = styled.div`
  border: 1px solid
    ${({ $boxStyle, theme }) =>
      $boxStyle
        ? theme.colors.primary[$boxStyle.bgColor]
        : theme.colors.primary.purple};

  border-radius: ${({ theme }) => theme.radius.medium};

  background-color: ${({ $boxStyle, theme }) =>
    $boxStyle && theme.colors.translucent[$boxStyle.bgColor]};

  border-color: ${({ $boxStyle, theme }) =>
    $boxStyle && theme.colors.primary[$boxStyle.lineColor]};

  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};
`;
