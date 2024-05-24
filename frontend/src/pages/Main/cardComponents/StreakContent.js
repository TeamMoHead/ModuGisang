import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import {
  level0,
  level1,
  level2,
  // level3,
  // level4,
} from '../../../assets/streakLevels';
import { gold, silver, bronze } from '../../../assets/medals';
import styled from 'styled-components';
import { LoadingWithText } from '../../../components';

const MEDAL_ICONS = {
  gold: gold,
  silver: silver,
  bronze: bronze,
};

const StreakContent = ({ isWaitingRoom, userData, showMedals = true }) => {
  const [level, setLevel] = useState('streak0');
  const { myData } = useContext(UserContext);
  const { streakDays, medals: medalCounts } = isWaitingRoom ? userData : myData;
  const [isDataLoading, setIsDataLoading] = useState(true);

  const getStreakLevel = streakDays => {
    if (streakDays < 7) {
      return 'streak0';
    } else if (streakDays >= 7 && streakDays < 100) {
      return 'streak1';
    } else if (streakDays >= 100 && streakDays < 365) {
      return 'streak2';
    }
    // } else if (streakDays >= 61 && streakDays <= 90) {
    //   return 'streak3';
    // } else if (streakDays >= 91) {
    //   return 'streak4';
    // }
  };

  const STREAK_LEVEL_ICON = {
    streak0: level0,
    streak1: level1,
    streak2: level2,
    // streak3: level3,
    // streak4: level4,
  };

  useEffect(() => {
    if (isWaitingRoom && !userData) return;
    if (!isWaitingRoom && Object.keys(myData).length === 0) return;
    setLevel(getStreakLevel(streakDays));
    setIsDataLoading(false);
  }, [myData, userData]);

  return (
    <Wrapper>
      {isDataLoading ? (
        <LoadingWrapper $showMedals={showMedals}>
          <LoadingWithText />
        </LoadingWrapper>
      ) : (
        <>
          <TopWrapper>
            <LevelIcon src={STREAK_LEVEL_ICON[level]} />
            <RightArea>
              <MediumLetter>미라클 모닝 성공</MediumLetter>
              <Days>
                <BigLetter>{streakDays}</BigLetter>
                <SmallLetter>일차</SmallLetter>
              </Days>
            </RightArea>
          </TopWrapper>
          <SeperateLine $isWide={isWaitingRoom} />
          {showMedals && (
            <>
              <BottomWrapper>
                <ChallengeRecordTitle>
                  <MediumLetter>챌린지 달성 기록</MediumLetter>
                </ChallengeRecordTitle>
                <Medals>
                  {['gold', 'silver', 'bronze'].map((medal, idx) => (
                    <MedalArea key={idx}>
                      {medalCounts[medal] > 0 && (
                        <MedalCount>{medalCounts[medal]}</MedalCount>
                      )}
                      <Medal
                        src={MEDAL_ICONS[medal]}
                        $hasMedal={medalCounts[medal] > 0}
                      />
                    </MedalArea>
                  ))}
                </Medals>
              </BottomWrapper>
            </>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default StreakContent;
const Wrapper = styled.div`
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
`;

const LoadingWrapper = styled.div`
  ${({ theme }) => theme.flex.center};
  width: 100%;

  ${({ $showMedals }) =>
    $showMedals ? 'padding: 89px 0px;' : 'padding: 54px 0px;'}
`;

const TopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 24px 24px 15px 24px;
`;

const SeperateLine = styled.div`
  width: ${({ $isWide }) => ($isWide ? '100%' : '90%')};
  height: 1px;
  background: ${({ theme }) => theme.colors.translucent.white};
`;

const BottomWrapper = styled.div`
  ${({ theme }) => theme.flex.between}
  width: 100%;
  height: 30px;
  padding: 24px;
  margin-block: 10px;
`;

const LevelIcon = styled.img`
  width: 110px;
  height: 110px;
`;

const RightArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
`;

const BigLetter = styled.span`
  ${({ theme }) => theme.fonts.JuaLargeMedium};
  ${({ theme }) => theme.flex.right};

  background: ${({ theme }) => theme.gradient.largerEmerald};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  width: 70%;
  background-clip: text;
  color: transparent;
`;

const MediumLetter = styled.span`
  ${({ theme }) => theme.flex.right}
  ${({ theme }) => theme.fonts.IBMmedium};
  color: ${({ theme }) => theme.colors.primary.white};
  font: 18px 'IBM Plex Sans KR';
  line-height: 22px;
  letter-spacing: -0.45%;
  font-weight: 600;
`;

const SmallLetter = styled.span`
  ${({ theme }) => theme.fonts.JuaSmall}
  margin-bottom: 10px;
  padding-left: 10px;
  padding-right: 5px;
  width: 30%;
`;

const ChallengeRecordTitle = styled.div`
  ${({ theme }) => theme.flex.between}
  width: 100%;
  height: 33px;
`;

const Medals = styled.div`
  ${({ theme }) => theme.flex.between}

  width: 100%;
`;

const MedalArea = styled.div`
  position: relative;

  width: 40px;
  height: 40px;
`;

const MedalCount = styled.span`
  z-index: 200;
  position: absolute;
  top: -3px;
  left: -7px;
  margin: auto;

  ${({ theme }) => theme.fonts.JuaSmall};
  color: ${({ theme }) => theme.colors.primary.white};
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
`;

const Medal = styled.img`
  position: absolute;
  top: 0px;
  left: ${({ $hasMedal }) => (!$hasMedal ? '0px' : '10px')};

  margin: auto;
  width: 30px;

  opacity: ${({ $hasMedal }) => (!$hasMedal ? 0.4 : 1)};
`;

const Days = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* 바닥에 정렬 */
  margin-top: 10px;
`;
