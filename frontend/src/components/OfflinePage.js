import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LongBtn } from './';
import * as S from '../styles/common';

const OfflinePage = () => {
  const navigate = useNavigate();
  return (
    <S.PageWrapper>
      인터넷이 연결되어 있지 않습니다. 네트워크를 확인해주세요.
      <LongBtn btnName="홈으로" onClickHandler={() => navigate('/main')} />
    </S.PageWrapper>
  );
};

export default OfflinePage;
