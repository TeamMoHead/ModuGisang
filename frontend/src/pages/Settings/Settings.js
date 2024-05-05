import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../../contexts';
import { authServices } from '../../apis';
import useFetch from '../../hooks/useFetch';
import { NavBar, Icon, CardBtn } from '../../components';
import * as S from '../../styles/common';
import styled from 'styled-components';

const Settings = () => {
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const { accessToken, setAccessToken, setUserId } = useContext(AccountContext);

  const { fetchData } = useFetch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    setIsLogoutLoading(true);
    const response = await fetchData(() =>
      authServices.logOutUser({ accessToken }),
    );
    const { isLoading: isLogoutLoading, error: logoutError } = response;
    if (!isLogoutLoading) {
      setUserId(null);
      setAccessToken(null);
      setIsLogoutLoading(false);
      localStorage.removeItem('refreshToken');
      alert('로그아웃 되었습니다.');
      navigate('/auth');
    } else if (logoutError) {
      setIsLogoutLoading(false);
      alert(logoutError);
    }
  };

  return (
    <>
      <NavBar />

      <S.PageWrapper>
        <CardBtn
          content={
            <LogoutWrapper>
              <Text>LogOut</Text>

              <Icon
                icon="logout"
                iconStyle={{ size: 24, color: 'white', disable: true }}
              />
            </LogoutWrapper>
          }
          btnStyle={{ bgColor: 'purple', color: 'white' }}
          onClickHandler={handleLogOut}
        />
      </S.PageWrapper>
    </>
  );
};

export default Settings;

const LogoutWrapper = styled.div`
  ${({ theme }) => theme.flex.center};
  font-weight: 500;
`;

const Text = styled.div`
  margin-right: 10px;
  ${({ theme }) => theme.fonts.button};
  color: ${({ theme }) => theme.colors.system.white};
`;
