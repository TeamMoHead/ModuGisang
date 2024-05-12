import React from 'react';
import styled, { css } from 'styled-components';

const boxStyleSample = {
  isBold: false,
  lineColor: 'white', // 'gradient'
  bgColor: 'dark', // 하얀 반투명 => 'white' || 어두운 반투명 'dark' || 완전투명 'transparent'
};

const headerSample = {
  text: '일자별 기록',
  style: {
    font: 'IBMmedium',
    fontColor: 'white',
    bgColor: 'purple',
    hasBackground: false, // 배경색이 채워져 있으면 true, 선만 있으면 false
  },
};

const OutlineBox = ({ boxStyle, header, content, onClickHandler }) => {
  const isClickable = !!onClickHandler;

  const boxStyleConverted = {
    isBold: boxStyle?.isBold,
    lineColor: LINE_COLORS[boxStyle?.lineColor],
    bgColor: BG_COLORS[boxStyle?.bgColor],
  };

  return (
    <Wrapper
      onClick={e => {
        if (!isClickable) return;

        e.preventDefault();
        e.stopPropagation();

        onClickHandler();
      }}
      $boxStyle={boxStyleConverted}
      $isClickable={isClickable}
    >
      {header && <Header $headerStyle={header?.style}>{header?.text}</Header>}
      {content}
    </Wrapper>
  );
};

export default OutlineBox;

const Wrapper = styled.div`
  width: 100%;
  ${({ $boxStyle }) => $boxStyle?.lineColor && $boxStyle.lineColor};
  border: solid transparent;
  ${({ $boxStyle }) => ($boxStyle?.isBold ? '3px' : '1px')};

  background: linear-gradient(135deg, #836fff, #15f5ba);
  /* background-origin: border-box;
  background-clip: content-box, border-box; */
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;

  border-radius: ${({ theme }) => theme.radius.medium};

  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};
`;

const Header = styled.div`
  padding: 11px;
  align-self: center;
  justify-self: center;
  text-align: center;

  border-radius: ${({ theme }) => theme.radius.small}
    ${({ theme }) => theme.radius.small} 0 0;

  ${({ theme, $headerStyle }) => theme.fonts[$headerStyle.font]};

  color: ${({ $headerStyle, theme }) =>
    $headerStyle && theme.colors.primary[$headerStyle.fontColor]};

  background-color: ${({ $headerStyle, theme }) =>
    $headerStyle.hasBackground && theme.colors.primary[$headerStyle.bgColor]};

  border: ${({ theme, $headerStyle }) =>
    $headerStyle.hasBackground ||
    `3px solid ${theme.colors.primary[$headerStyle.bgColor]}`};
`;

const LINE_COLORS = {
  purple: 'purple',
};

const BG_COLORS = {
  white: css`
    background-color: ${({ theme }) => theme.colors.translucent.white};
  `,

  dark: css`
    ${({ theme }) => theme.gradient.background.translucentGray}
    ${({ theme }) => theme.gradient.border}
  `,

  transparent: css`
    background-color: transparent;
  `,
};
