import React from 'react';
import styled from 'styled-components';

const MissionTitle = ({ text }) => {
  return <Wrapper>{text}</Wrapper>;
};

export default MissionTitle;

const Wrapper = styled.div`
  ${({ theme }) => theme.fonts.title}
  text-align: center;
  font-size: 30px;
`;
