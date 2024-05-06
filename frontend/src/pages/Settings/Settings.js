import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../../contexts';
import { authServices, userServices } from '../../apis';
import useFetch from '../../hooks/useFetch';
import { NavBar, Icon, CardBtn, SimpleBtn, InputBox } from '../../components';
import * as S from '../../styles/common';
import styled from 'styled-components';

const Settings = () => {
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const { accessToken, setAccessToken, setUserId, userId } =
    useContext(AccountContext);

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

  const handleAffirmationChange = e => {
    console.log(e.target.value);
    setAffirmation(e.target.value);
  };

  const handleChangeAffirmation = async () => {
    const response = await fetchData(() =>
      userServices.changeAffirmation({ accessToken, affirmation, userId }),
    );
    console.log(response);
  };

  return (
    <>
      <NavBar />

      <S.PageWrapper>
        <InputBox
          label="Affirmation"
          type="text"
          value={affirmation}
          onChange={handleAffirmationChange}
        />
        <SimpleBtn
          btnName="오늘의 한마디 수정하기"
          onClickHandler={() => {
            handleChangeAffirmation({ accessToken, affirmation });
          }}
        />
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
