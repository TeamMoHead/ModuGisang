import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import './slider.css';

// import required modules
import { Pagination } from 'swiper/modules';

const SliderContent = ({ challenges }) => {
  if (!challenges || challenges.length === 0) {
    return <div>loading...</div>;
  }
  const remainingDays =
    calculateRemainingDays(challenges.startDate, challenges.duration) - 1;

  const matesNames = challenges.mates?.map(mate => mate.userName).join(', ');

  const sliderBox = [
    <SlideContent>
      매일 아침{' '}
      <HighlightText>
        {challenges.wakeTime?.split(':')?.slice(0, 2)?.join(':')}
      </HighlightText>
      에 일어나요
    </SlideContent>,
    <SlideContent>
      {' '}
      <HighlightText>{matesNames}</HighlightText>
      {' 과(와) 함께 하고 있어요'}
    </SlideContent>,
    <SlideContent>
      완료까지 <HighlightText>{remainingDays}일</HighlightText> 남았어요
    </SlideContent>,
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
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
  padding-bottom: 30px;
`;

const ChallengeTitle = styled.span`
  color: ${({ theme }) => theme.colors.primary.purple};
  justify-content: center;
  ${({ theme }) => theme.fonts.JuaSmall};
  margin: 14px 0 10px 0;
`;

const HighlightText = styled.span`
  color: ${({ theme }) => theme.colors.primary.white};
  font-weight: 600;

  margin: 0 5px;
`;
const SlideContent = styled.div`
  color: ${({ theme }) => theme.colors.neutral.lightGray};
  text-align: center;
  ${({ theme }) => theme.fonts.IBMsmall}
  font-size: 13px;
  padding: 0 10px;
`;
