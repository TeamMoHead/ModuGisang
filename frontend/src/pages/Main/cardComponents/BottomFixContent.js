import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import EnterContent from './EnterContent';
import TimerIcon from '../../../assets/TimerIcon';
import SadIcon from '../../../assets/SadIcon';
import CreateContent from './CreateContent';

const BottomFixContent = ({ challengeData, Handler }) => {
  const challengeId = challengeData.challengeId;
  const wakeTime = challengeData.wakeTime;
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  useEffect(() => {
    console.log('wakeTime', wakeTime);
    if (!wakeTime) return; // wakeTime이 없으면 실행하지 않음
    console.log('wakeTime2', wakeTime);
    const [hours, minutes, seconds] = wakeTime.split(':').map(Number);
    const targetTime = new Date();
    targetTime.setHours(hours, minutes, seconds, 0);

    console.log('targetTime', targetTime);

    const countdown = () => {
      const interval = setInterval(() => {
        const now = new Date();
        const difference = targetTime - now;

        if (difference <= 0) {
          clearInterval(interval);
          setTimeLeft('00:00:00');
        } else {
          const remainingHours = String(
            Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          ).padStart(2, '0');
          const remainingMinutes = String(
            Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          ).padStart(2, '0');
          const remainingSeconds = String(
            Math.floor((difference % (1000 * 60)) / 1000),
          ).padStart(2, '0');
          setTimeLeft(
            `${remainingHours}:${remainingMinutes}:${remainingSeconds}`,
          );
        }
      }, 1000);

      return () => clearInterval(interval);
    };

    countdown();
  }, [wakeTime]);

  return (
    <Wrapper>
      {challengeId === -1 || challengeId === undefined ? (
        <>
          <ChallengeTitle>참여중인 챌린지가 없어요</ChallengeTitle>
          <SeperateLine />
          <IconWrapper>
            <SadIcon />
          </IconWrapper>
          <CreateContent onClickHandler={Handler.create} />
        </>
      ) : (
        <>
          <TimeDisplay>
            <TimeTitleWrapper>
              <TimerIcon />
              <TimeTitle>기상까지 남은 시간</TimeTitle>
            </TimeTitleWrapper>
            <SeperateLine />
            <Timer>{timeLeft}</Timer>
          </TimeDisplay>
          <EnterContent onClickHandler={Handler.enter} />
        </>
      )}
    </Wrapper>
  );
};

export default BottomFixContent;
const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 240px;
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
  background: ${({ theme }) => theme.gradient.largerEmerald};
  border-radius: 30px 30px 0 0;
  z-index: 1000;
`;
const TimeTitleWrapper = styled.div`
  ${({ theme }) => theme.flex.between}
  margin-top:10px
`;

const TimeDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const TimeTitle = styled.div`
  ${({ theme }) => theme.fonts.IBMmedium};
  color: ${({ theme }) => theme.colors.primary.white};

  margin: 0 10px;
  font-weight: 600;
  font-style: normal;
  line-height: 22px; /* 122.222% */
  letter-spacing: -0.45px;
`;

const ChallengeTitle = styled.div`
  ${({ theme }) => theme.fonts.IBMmedium};
  color: ${({ theme }) => theme.colors.primary.white};

  margin: 20px 10px 0 0;
  font-weight: 600;
  font-style: normal;
  line-height: 22px; /* 122.222% */
  letter-spacing: -0.45px;
`;

const Timer = styled.div`
  ${({ theme }) => theme.fonts.JuaLarge};
  color: ${({ theme }) => theme.colors.primary.white};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 텍스트 그림자 추가 */
`;

const SeperateLine = styled.hr`
  width: 50%;
  height: 2px;
  background-color: rgba(240, 243, 255, 0.2);
  border: none;
`;

const IconWrapper = styled.div`
  margin: 30px;
`;