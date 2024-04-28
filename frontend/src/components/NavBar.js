import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '../components';
import styled from 'styled-components';

const NavBar = ({ pageType }) => {
  const { pathname } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [hasLeftBtn, setHasLeftBtn] = useState(true);
  const [hasRightBtn, setHasRightBtn] = useState(true);
  const [pageTitle, setPageTitle] = useState('');

  const TITLE_BY_PAGE_TYPE = {
    main: '',
    myStreak: '',
    joinChallenge: '',
    createChallenge: '',
    settings: '',
  };

  const goBack = () => {
    navigate(-1);
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  useEffect(() => {
    console.log('path: ', pathname, 'Params:', params);
  }, [params]);

  return (
    <Wrapper>
      {hasLeftBtn && (
        <Icon icon="back" iconStyle={BackBtnStyle} onClickHandler={goBack} />
      )}
      {pageTitle}
      {hasRightBtn && (
        <Icon
          icon="settings"
          iconStyle={SettingsBtnStyle}
          onClickHandler={goToSettings}
        />
      )}
    </Wrapper>
  );
};

export default NavBar;

const Wrapper = styled.nav`
  position: fixed;
  top: 0;
  ${({ theme }) => theme.flex.between}
  width: 100vw;
  height: 50px;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.colors.primary.light};
`;

const BackBtnStyle = {
  size: 24,
  color: 'main',
};

const SettingsBtnStyle = {
  size: 24,
  color: 'main',
};
