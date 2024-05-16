import styled from 'styled-components';

const convertISOToDate = isoString => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

const converDuration = duration => {
  if (duration === 7) {
    return '7일 (동메달)';
  } else if (duration === 30) {
    return '30일 (은메달)';
  } else if (duration === 100) {
    return '100일 (금메달)';
  }
};

const convertWakeTime = wakeTime => {
  const [hours, minutes, seconds] = wakeTime.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12; // 0 or 12 should be converted to 12
  const formattedHours = String(adjustedHours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${period}`;
};

const InvitationCard = ({ invitation }) => {
  let duration = converDuration(invitation.duration);
  let startDate = convertISOToDate(invitation.startDate);
  let wakeTime = convertWakeTime(invitation.wakeTime);

  return (
    <Wrapper>
      <Profile
        src={`https://api.dicebear.com/8.x/open-peeps/svg?seed=${invitation.userName}`}
      />
      <TextBox>
        <CardText>
          <MiniCircle />
          <BoldText>챌린지 호스트 | </BoldText> {invitation.userName}
        </CardText>
        <CardText>
          <MiniCircle />
          <BoldText>시작 날짜 | </BoldText> {startDate}
        </CardText>
        <CardText>
          <MiniCircle />
          <BoldText>기상 시간 | </BoldText> {wakeTime}
        </CardText>
        <CardText>
          <MiniCircle />
          <BoldText>지속 기간 | </BoldText> {duration}
        </CardText>
      </TextBox>
    </Wrapper>
  );
};

export default InvitationCard;

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.left}
  background-color: ${({ theme }) => theme.colors.translucent.white};
  width: 100%;
  height: auto;
  border: 1px solid ${({ theme }) => theme.colors.primary.purple};
  border-radius: 20px;
  padding: 10px;
`;

const Profile = styled.img`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary.white};
  margin: 5px;
`;

const TextBox = styled.div`
  ${({ theme }) => theme.flex.center}
  flex-direction:column;
  align-items: flex-start;
`;

const CardText = styled.div`
  ${({ theme }) => theme.flex.center};
  ${({ theme }) => theme.fonts.IBMsmall}
  padding:5px;
`;

const BoldText = styled.span`
  font-weight: 900;
  margin-right: 5px;
`;

const MiniCircle = styled.div`
  background-color: ${({ theme }) => theme.colors.primary.white};
  width: 7px;
  height: 7px;
  border-radius: 50px;
  margin-right: 5px;
`;
