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
  faStopwatch,
  faFaceSadTear,
  faMagnifyingGlass,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

import noMusic from '../assets/icons/musicOff.svg';

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
  musicOn: faMusic,
  musicOff: noMusic,
  micOn: faMicrophone,
  micOff: faMicrophoneSlash,
  timer: faStopwatch,
  sad: faFaceSadTear,
  search: faMagnifyingGlass,
  close: faXmark,
  timer: faStopwatch,
  sad: faFaceSadTear,
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
      {typeof iconList[icon] === 'string' ? (
        <img
          src={iconList[icon]}
          alt={icon}
          style={{ width: `${iconStyle.size}px` }}
        />
      ) : (
        <FontAwesomeIcon icon={iconList[icon]} />
      )}
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
