import React from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAnglesLeft,
  faHome,
  faUser,
  faSignOutAlt,
  faUserCheck,
  faTrashCan,
  faSadTear,
  faSpinner,
  faGear,
  faMicrophone,
  faMicrophoneSlash,
  faMusic,
  faMagnifyingGlass,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

const iconList = {
  home: faHome,
  back: faAnglesLeft,
  login: faUserCheck,
  logout: faSignOutAlt,
  user: faUser,
  trash: faTrashCan,
  sadFace: faSadTear,
  loading: faSpinner,
  settings: faGear,
  music: faMusic,
  micOn: faMicrophone,
  micOff: faMicrophoneSlash,
  search: faMagnifyingGlass,
  close: faXmark,
};

const iconStyleSample = {
  size: 24,
  color: 'purple',
  hoverColor: 'white',
};

const Icon = ({ icon, iconStyle }) => {
  return (
    <IconWrapper $iconStyle={iconStyle}>
      <FontAwesomeIcon icon={iconList[icon]} />
    </IconWrapper>
  );
};

export default Icon;

const IconWrapper = styled.div`
  z-index: 100;
  width: auto;
  padding: 5px;

  color: ${({ $iconStyle, theme }) =>
    $iconStyle.color
      ? theme.colors.primary[$iconStyle.color]
      : theme.colors.neutral.gray};
  opacity: 1;

  font-size: ${({ $iconStyle }) =>
    $iconStyle.size ? `${$iconStyle.size}px` : '16px'};

  &:hover {
    color: ${({ theme, $iconStyle }) =>
      $iconStyle.hoverColor
        ? theme.colors.primary[$iconStyle.hoverColor]
        : theme.colors.primary.emerald};
  }
`;
