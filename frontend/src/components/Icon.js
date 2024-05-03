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
  micOn: faMicrophone,
  micOff: faMicrophoneSlash,
};

const iconStyleSample = {
  size: 24,
  color: 'purple',
  hoverColor: 'white',
  disable: false,
};

const Icon = ({ icon, iconStyle, onClickHandler }) => {
  return (
    <IconWrapper
      $iconStyle={iconStyle}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();

        if (onClickHandler) {
          console.log('try!');
          onClickHandler(e);
        }
      }}
    >
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
      : theme.colors.text.gray};
  opacity: 1;

  font-size: ${({ $iconStyle }) =>
    $iconStyle.size ? `${$iconStyle.size}px` : '16px'};

  cursor: ${({ $iconStyle }) => ($iconStyle.disable ? 'default' : 'pointer')};

  &:hover {
    color: ${({ theme, $iconStyle }) =>
      $iconStyle.hoverColor
        ? theme.colors.primary[$iconStyle.hoverColor]
        : theme.colors.primary.emerald};
  }

  ${({ $iconStyle }) =>
    $iconStyle.disable &&
    css`
      pointer-events: none;
    `}
`;
