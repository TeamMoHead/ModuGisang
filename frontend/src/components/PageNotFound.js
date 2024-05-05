import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleBtn } from './';
import * as S from '../styles/common';

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <S.PageWrapper>
      존재하지 않는 페이지 입니다.
      <SimpleBtn btnName="홈으로" onClickHandler={() => navigate('/main')} />
    </S.PageWrapper>
  );
};

export default PageNotFound;
