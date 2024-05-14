import React from 'react';
import styled from 'styled-components';

const EnterContent = ({ onClickHandler }) => {
  return <Wrapper onClick={onClickHandler}>챌린지 참여하기</Wrapper>;
};

export default EnterContent;

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.center};
  ${({ theme }) => theme.fonts.JuaSmall};

  padding: 10px 10px 6px 10px;

  border-radius: ${({ theme }) => theme.radius.medium};

  background: rgba(13, 10, 45, 0.75);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);
  border: 1px solid var(--Gradient-Emerald, #836fff);

  width: 300px;
  height: 56px;
  z-index: 1000;
`;
