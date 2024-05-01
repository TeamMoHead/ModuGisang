import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '../components';
import styled from 'styled-components';

const NavBar = () => {
  const { pathname } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [hasLeftBtn, setHasLeftBtn] = useState(false);
  const [hasRightBtn, setHasRightBtn] = useState(true);
  const [pageType, setPageType] = useState('main');

  const TITLE_BY_PAGE_TYPE = {
    main: '모두기상',
    myStreak: '나의 기록',
    joinChallenge: '챌린지 참여',
    createChallenge: '챌린지 만들기',
    settings: '설정',
  };

  const goBack = () => {
    navigate('/');
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  useEffect(() => {
    const page = pathname.split('/')[1];

    if (page) {
      setPageType(page);

      if (page === 'settings') {
        setHasLeftBtn(true);
        setHasRightBtn(false);
      } else if (page === 'main') {
        setHasLeftBtn(false);
        setHasRightBtn(true);
      } else {
        setHasLeftBtn(true);
        setHasRightBtn(true);
      }
    } else {
      setHasLeftBtn(false);
      setHasRightBtn(true);
    }
  }, [params]);

  return (
    <Wrapper>
      <BtnArea $hasRightBtn={hasRightBtn}>
        {hasLeftBtn && (
          <Icon icon="back" iconStyle={BackBtnStyle} onClickHandler={goBack} />
        )}
        <Title $hasRightBtn={hasRightBtn} $hasLeftBtn={hasLeftBtn}>
          {TITLE_BY_PAGE_TYPE[pageType]}
        </Title>
        {hasRightBtn && (
          <Icon
            icon="settings"
            iconStyle={SettingsBtnStyle}
            onClickHandler={goToSettings}
          />
        )}
      </BtnArea>
    </Wrapper>
  );
};

export default NavBar;

const Wrapper = styled.nav`
  position: fixed;
  top: 0;

  ${({ theme }) => theme.flex.between}
  align-items: center;

  width: 100vw;
  height: 50px;

  background-color: ${({ theme }) => theme.colors.lighter.light};
`;

const BtnArea = styled.div`
  position: fixed;
  top: 0;

  width: 100vw;
  height: 50px;
  padding: 0 20px;
  ${({ theme, $hasRightBtn }) =>
    $hasRightBtn ? theme.flex.between : theme.flex.right}
`;

const Title = styled.h2`
  ${({ theme }) => theme.fonts.title}

  width: 100vw;
  height: 50px;
  margin-left: ${({ $hasRightBtn }) => ($hasRightBtn ? '0' : '-35px')};
  margin-right: ${({ $hasLeftBtn }) => ($hasLeftBtn ? '0' : '-35px')};
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
`;

const BackBtnStyle = {
  size: 24,
  color: 'purple',
};

const SettingsBtnStyle = {
  size: 24,
  color: 'purple',
};
