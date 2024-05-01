import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';

const Main = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { fetchData } = useFetch();
  const { handleCheckAuth } = useAuth();
  const navigate = useNavigate();

  // challenge id는 서버에서 받아온 값으로 대체
  const challengeId = '1234';

  const checkAuthorize = async () => {
    try {
      const response = await fetchData(() => handleCheckAuth());
      const {
        isLoading: isAuthLoading,
        data: authData,
        error: authError,
      } = response;
      if (!isAuthLoading) {
        setIsAuthLoading(false);
        setIsAuthorized(true);
      } else if (authError) {
        setIsAuthLoading(false);
        setIsAuthorized(false);
        navigate('/auth');
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  useEffect(() => {
    checkAuthorize();
  }, []);

  if (isAuthorized === false)
    return <div>접근이 허용되지 않은 페이지입니다.</div>;
  if (isAuthLoading) return <div>Loading...</div>;

  return (
    <Wrapper>
      <div>
        <p>Main</p>
        <button
          onClick={() => {
            navigate('/settings');
          }}
        >
          settings
        </button>
        <EnterBtn
          onClick={() => {
            navigate(`/inGame/${challengeId}`);
          }}
        >
          Start Game
        </EnterBtn>
      </div>
    </Wrapper>
  );
};

export default Main;

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.center}
  flex-direction: column;

  gap: 20px;
  margin: auto;
  padding: 20px;
`;

const EnterBtn = styled.button`
  width: 100px;
  height: 50px;
  ${({ theme }) => theme.flex.center}

  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.primary.dark};
  color: ${({ theme }) => theme.colors.white};
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
`;
