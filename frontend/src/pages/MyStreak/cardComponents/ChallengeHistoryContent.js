import React, { useContext, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { UserContext } from '../../../contexts';
import { CHALLANGE_HISTORY_TEXT } from '../DATA';

const ChallengeHistoryContent = ({ selectedDate, history }) => {
  const { myData } = useContext(UserContext);
  const { userName } = myData;

  const [sortedHistory, setSortedHistory] = useState([]);

  useEffect(() => {
    if (history && history.length > 0) {
      const newSortedHistory = [...history]
        .map((item, index) => ({
          ...item,
          score: parseFloat(item.score.toFixed(1)),
        }))
        .map((item, index) => ({
          ...item,
          rank: index + 1,
        }));
      setSortedHistory(newSortedHistory);
    }
  }, [selectedDate, history]);

  if (!history || history.length === 0 || sortedHistory.length === 0) {
    return (
      <HistoryWrapper>
        <NoHistoryText>{CHALLANGE_HISTORY_TEXT.noHistory}</NoHistoryText>
      </HistoryWrapper>
    );
  }

  const formatWakeTime = time => {
    const [hour, minute] = time.split(':');
    if (parseInt(hour, 10) < 12) {
      return `${parseInt(hour, 10)}:${parseInt(minute, 10)} AM`;
    } else if (parseInt(hour, 10) === 12) {
      return `${parseInt(hour, 10)}:${parseInt(minute, 10)} PM`;
    } else {
      return `${parseInt(hour, 10) - 12}시 ${parseInt(minute, 10)} PM`;
    }
  };

  const myHistory = sortedHistory.find(item => item.userName === userName);
  const wakeTime = formatWakeTime(myHistory.wakeTime);
  const myScore = myHistory.score;
  const myRank = myHistory.rank;

  return (
    <HistoryWrapper>
      <TextWrapper>
        <MiniCircle />
        <WakeUpWrapper>
          <BoldText>{CHALLANGE_HISTORY_TEXT.wakeTime}</BoldText>
          <BoldText>|</BoldText>
          <PlainText>{wakeTime}</PlainText>
        </WakeUpWrapper>
      </TextWrapper>
      <TextWrapper>
        <MiniCircle />
        <ScoreWrapper>
          <BoldText>{CHALLANGE_HISTORY_TEXT.score}</BoldText>
          <BoldText>|</BoldText>
          <PlainText>{myScore}점</PlainText>
          <PlainText>({myRank}위)</PlainText>
        </ScoreWrapper>
      </TextWrapper>
      <TextWrapper>
        <MiniCircle />
        <BoldText>{CHALLANGE_HISTORY_TEXT.mates}</BoldText>
      </TextWrapper>
      <MatesContainer>
        {sortedHistory.map((item, index) => (
          <MatesWrapper key={index}>
            <UserProfile
              src={`https://api.dicebear.com/8.x/open-peeps/svg?seed=${item.userName}`}
            />
            <BoldText>{item.userName}</BoldText>
            <BoldText>|</BoldText>
            <PlainText>{item.score}점</PlainText>
            <PlainText>({item.rank}위)</PlainText>
          </MatesWrapper>
        ))}
      </MatesContainer>
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
  width: 80%;
  justify-content: space-between;
  margin: 14px 0 7px 0;
  flex-direction: row;
`;

const WakeUpWrapper = styled.div`
  ${({ theme }) => theme.flex.left}
  width: 50%;
  justify-content: space-between;
`;

const ScoreWrapper = styled.div`
  ${({ theme }) => theme.flex.left}
  width: 70%;
  justify-content: space-between;
`;

const MatesContainer = styled.div`
  ${({ theme }) => theme.flex.left}
  flex-direction: column;
`;

const NoHistoryText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary.gray};
`;

const UserProfile = styled.img`
  width: 31px;
  height: 31px;
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
