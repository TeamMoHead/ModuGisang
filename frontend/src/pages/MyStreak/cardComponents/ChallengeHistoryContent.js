import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { UserContext } from '../../../contexts';

const ChallengeHistoryContent = ({ selectedDate, history }) => {
  const { myData } = useContext(UserContext);
  const { userName } = myData;

  console.log(selectedDate);

  if (!history || history.length === 0) {
    return (
      <HistoryWrapper>
        <NoHistoryText>선택한 날짜의 챌린지 기록이 없습니다.</NoHistoryText>
      </HistoryWrapper>
    );
  }
  const myHistory = history.filter(item => item.userName === userName);
  console.log('나의 기록', myHistory);
  const { wakeTime, myScore } = myHistory;

  return (
    <HistoryWrapper>
      <TextWrapper>
        <MiniCircle />
        <BoldText>기상 시간 |</BoldText>
        <PlainText>{wakeTime}</PlainText>
      </TextWrapper>
      <TextWrapper>
        <MiniCircle />
        <BoldText>미라클 게임 결과 | </BoldText>
        <PlainText>{myScore}점</PlainText>
      </TextWrapper>
      <TextWrapper>
        <MiniCircle />
        <BoldText>미라클 메이트</BoldText>
      </TextWrapper>
      {history.map((item, index) => (
        <MatesWrapper>
          <UserProfile
            key={item.userName}
            src={`https://api.dicebear.com/8.x/open-peeps/svg?seed=${item.userName}`}
          />
          <BoldText key={index}>{item.userName} |</BoldText>
          <PlainText>{item.score}점</PlainText>
        </MatesWrapper>
      ))}
    </HistoryWrapper>
  );
};

export default ChallengeHistoryContent;

const HistoryWrapper = styled.div`
  padding: 16px;
`;

const TextWrapper = styled.div`
  ${({ theme }) => theme.flex.left};
  ${({ theme }) => theme.fonts.IBMsmall}
  margin: 14px 0 14px 0;
`;

const MatesWrapper = styled.div`
  ${({ theme }) => theme.flex.left}
  justify-content: space-evenly;
  margin: 14px 0 7px 14px;
  flex-direction: row;
`;

const NoHistoryText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary.gray};
`;

const UserProfile = styled.img`
  width: 25px;
  height: 25px;

  border-radius: 50%;
  object-fit: cover;
  background-color: ${({ theme }) => theme.colors.primary.white};

  ${({ $profileInline }) =>
    $profileInline &&
    css`
      position: absolute;
      left: 0;
    `}
`;

const BoldText = styled.span`
  ${({ theme }) => theme.fonts.IBMsmallBold}
`;

const PlainText = styled.span`
  ${({ theme }) => theme.fonts.IBMxsmall}
`;

const MiniCircle = styled.div`
  background-color: ${({ theme }) => theme.colors.primary.white};
  width: 7px;
  height: 7px;
  border-radius: 50px;
  margin-right: 5px;
`;
