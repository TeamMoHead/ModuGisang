import styled from 'styled-components';
import { useSafeAreaInsets } from '../contexts/SafeAreaContext';
import { useState, useEffect } from 'react';

const SafeArea = ({ children }) => {
  const insets = useSafeAreaInsets();
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    // 강제 재렌더링을 위해 key를 업데이트
    if (insets.top !== undefined) {
      setRenderKey(prevKey => prevKey + 1);
    }
  }, [insets]);

  console.log('final insets:', insets);

  return (
    <SafeAreaWrapper insets={insets} key={renderKey}>
      {children}
    </SafeAreaWrapper>
  );
};

const SafeAreaWrapper = styled.div`
  padding-top: 59px;
  height: 100%;
  width: 100%;
  /* border: 5px solid red; */
  box-sizing: border-box;
`;

export default SafeArea;
