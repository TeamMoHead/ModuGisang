import React, { useState, useEffect } from 'react';
import { oneImage, twoImege, threeImage } from '../../../assets/numbers';

import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 이미지는 50% 크기로 (임시)
const Image = styled.img`
  height: 50%;
  width: 50%;
`;

const CountdownImage = ({ number }) => {
  let imageUrl = '';
  switch (
    number // 숫자에 따라 다른 이미지 보여 주기
  ) {
    case 3:
      imageUrl = threeImage;
      break;
    case 2:
      imageUrl = twoImege;
      break;
    case 1:
      imageUrl = oneImage;
      break;
    default:
      imageUrl = 'default_image_url';
  }

  return (
    <Container>
      <Image src={imageUrl} alt={`Countdown ${number}`} />
    </Container>
  );
};

const Countdown = () => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (count > 1) {
        setCount(count - 1);
      } else {
        // 카운트다운이 끝났을 때 할 동작
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div>
      <CountdownImage number={count} />
    </div>
  );
};

export default Countdown;
