import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { gold, silver, bronze } from '../../../assets/medals';

import styled from 'styled-components';
import { rainEffect } from '../../InGame/Mission4/effect';

const CHALLENGE_DATA = {
  medals: {
    gold: gold,
    silver: silver,
    bronze: bronze,
  },
  texts: {
    gold: '100일 챌린지',
    silver: '30일 챌린지',
    bronze: '7일 챌린지',
  },
};

const MedalContent = () => {
  const { myData } = useContext(UserContext);

  const myGoldMedals = myData?.medals?.gold;
  const mySilverMedals = myData?.medals?.silver;
  const myBronzeMedals = myData?.medals?.bronze;

  useEffect(() => {
    if (!myData) return;
  }, [myData]);

  return (
    <>
      <MedalContentWrapper>
        <MedalsWrapper>
          <MedalsInfoWrapper>
            <MedalIcon src={CHALLENGE_DATA.medals.gold} />
            <ChallengeText>{CHALLENGE_DATA.texts.gold}</ChallengeText>
          </MedalsInfoWrapper>
          <MedalsCountWrapper>
            <ChallengeDaysCount>{myGoldMedals}회</ChallengeDaysCount>
            <ChallengeText>달성</ChallengeText>
          </MedalsCountWrapper>
        </MedalsWrapper>
        <MedalsWrapper>
          <MedalsInfoWrapper>
            <MedalIcon src={CHALLENGE_DATA.medals.silver} />
            <ChallengeText>{CHALLENGE_DATA.texts.silver}</ChallengeText>
          </MedalsInfoWrapper>
          <MedalsCountWrapper>
            <ChallengeDaysCount>{mySilverMedals}회</ChallengeDaysCount>
            <ChallengeText>달성</ChallengeText>
          </MedalsCountWrapper>
        </MedalsWrapper>
        <MedalsWrapper>
          <MedalsInfoWrapper>
            <MedalIcon src={CHALLENGE_DATA.medals.bronze} />
            <ChallengeText>{CHALLENGE_DATA.texts.bronze}</ChallengeText>
          </MedalsInfoWrapper>
          <MedalsCountWrapper>
            <ChallengeDaysCount>{myBronzeMedals}회</ChallengeDaysCount>
            <ChallengeText>달성</ChallengeText>
          </MedalsCountWrapper>
        </MedalsWrapper>
      </MedalContentWrapper>
    </>
  );
};

export default MedalContent;

const MedalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 33px 35px 29px 36px;
`;

const MedalsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin: 0px 0px 13px 0px;
`;

const MedalsInfoWrapper = styled.div`
  ${({ theme }) => theme.flex.left}
  width: 55%;
  flex-direction: row;
  justify-content: space-between;
`;

const MedalsCountWrapper = styled.div`
  ${({ theme }) => theme.flex.right}
  width: 27%;
  flex-direction: row;
  justify-content: space-evenly;
`;

const MedalIcon = styled.img`
  width: 35px;
  height: 43px;
`;

const ChallengeText = styled.div`
  ${({ theme }) => theme.fonts.IBMsamll};
`;

const ChallengeDaysCount = styled.div`
  ${({ theme }) => theme.fonts.JuaSmall};
`;
