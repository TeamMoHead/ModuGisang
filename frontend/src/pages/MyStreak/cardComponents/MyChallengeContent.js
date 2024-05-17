import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { gold, silver, bronze } from '../../../assets/medals';

import styled from 'styled-components';

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

const MyChallengeContent = () => {
  const { myData } = useContext(UserContext);

  const myGoldMedals = myData?.medals?.gold;
  const mySilverMedals = myData?.medals?.silver;
  const myBronzeMedals = myData?.medals?.bronze;

  console.log(myData);

  useEffect(() => {
    if (!myData) return;
  }, [myData]);

  return (
    <>
      <MyChallengeContentWrapper>
        <MedalsWrapper>
          <MedalIcon src={CHALLENGE_DATA.medals.gold} />
          <ChallengeText>{CHALLENGE_DATA.texts.gold}</ChallengeText>
          <ChallengeDaysCount>{myGoldMedals}회</ChallengeDaysCount>
          <ChallengeText>달성</ChallengeText>
        </MedalsWrapper>
        <MedalsWrapper>
          <MedalIcon src={CHALLENGE_DATA.medals.silver} />
          <ChallengeText>{CHALLENGE_DATA.texts.silver}</ChallengeText>
          <ChallengeDaysCount>{mySilverMedals}회</ChallengeDaysCount>
          <ChallengeText>달성</ChallengeText>
        </MedalsWrapper>
        <MedalsWrapper>
          <MedalIcon src={CHALLENGE_DATA.medals.bronze} />
          <ChallengeText>{CHALLENGE_DATA.texts.bronze}</ChallengeText>
          <ChallengeDaysCount>{myBronzeMedals}회</ChallengeDaysCount>
          <ChallengeText>달성</ChallengeText>
        </MedalsWrapper>
      </MyChallengeContentWrapper>
    </>
  );
};

export default MyChallengeContent;

const MyChallengeContentWrapper = styled.div`
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

const MedalIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const ChallengeText = styled.div`
  ${({ theme }) => theme.fonts.IBMsamll};
`;

const ChallengeDaysCount = styled.div`
  ${({ theme }) => theme.fonts.JuaSmall};
`;
