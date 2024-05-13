import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';

// import './styles.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import './slider.css';

// import required modules
import { Pagination } from 'swiper/modules';

const SliderContent = ({ challenges }) => {
  console.log('@@@@@@@@@@@', challenges);
  if (!challenges || challenges.length === 0) {
    return <div>loading...</div>;
  }
  const remainingDays =
    calculateRemainingDays(challenges.startDate, challenges.duration) - 1;
  const sliderBox = [
    <Div1>
      매일 아침
      <p> {challenges.wakeTime?.split(':')?.slice(0, 2)?.join(':')}</p>에
      일어나요
    </Div1>,

    <Div2>
      {challenges.mates?.map(mate => (
        <SmallLetter key={mate.userId}>{mate.userName}, </SmallLetter>
      ))}
      과(와) 함께 하고 있어요
    </Div2>,
    <Div3>완료까지 {remainingDays}일 남았어요</Div3>,
  ];

  function calculateRemainingDays(startDate, duration) {
    // 시작일 객체 생성
    var start = new Date(startDate);

    // 종료일 객체 생성
    var end = new Date(start);
    end.setDate(end.getDate() + duration);

    // 현재 날짜 객체 생성
    var currentDate = new Date();

    // 종료일과 현재 날짜 사이의 차이를 계산하여 일 수로 반환
    var remainingDays = Math.ceil((end - currentDate) / (1000 * 60 * 60 * 24));

    return remainingDays;
  }

  return (
    <>
      <Swiper
        autoplay={{ delay: 1000 }} //3초
        loop={true} //반복
        spaceBetween={50}
        // onSlideChange={() => console.log('slide change')}
        onSwiper={swiper => console.log(swiper)}
        pagination={{
          dynamicBullets: true,
          bulletClass: 'swiper-pagination-bullet', // bullet의 클래스명
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {sliderBox.map((challenge, index) => (
          <SwiperSlide key={index}>
            <Wrapper>
              <ChallengeTitle>진행 중 챌린지</ChallengeTitle>
              {challenge}
            </Wrapper>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SliderContent;

const Wrapper = styled.div`
  width: 100%;
  height: 140px;
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
  padding-bottom: 40px;
`;

const ChallengeTitle = styled.span`
  color: ${({ theme }) => theme.colors.primary.purple};
  ${({ theme }) => theme.fonts.JuaSmall};
  width: 173px;
  height: 46.8px;
`;

const SmallLetter = styled.span`
  ${({ theme }) => theme.fonts.IBMsmall}
`;

const Div1 = styled.div`
  ${({ theme }) => theme.flex.center}
  color: ${({ theme }) => theme.colors.primary.white};
`;

const Div2 = styled.div`
  ${({ theme }) => theme.flex.center}
  color: ${({ theme }) => theme.colors.primary.white};
`;

const Div3 = styled.div`
  ${({ theme }) => theme.flex.center}
  color: ${({ theme }) => theme.colors.primary.white};
`;
