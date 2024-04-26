import React from 'react';
import styled from 'styled-components';

const CardBtn = ({ content, onClickHandler, btnStyle }) => {
  return (
    <Wrapper
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();

        onClickHandler();
      }}
      $btnStyle={btnStyle}
    >
      {content}
    </Wrapper>
  );
};

export default CardBtn;

const Wrapper = styled.div`
  flex-direction: column;

  background-color: ${({ $btnStyle, theme }) =>
    $btnStyle
      ? theme.colors.primary[$btnStyle.bgColor]
      : theme.colors.primary.main};

  border-radius: ${({ theme }) => theme.radius.basic};
`;
