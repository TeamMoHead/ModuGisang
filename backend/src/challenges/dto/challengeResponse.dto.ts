export class ChallengeResponseDto {
  _id: number;
  startDate: Date;
  wakeTime: Date;
  durationDays: number;
  mates: ParticipantDto[]
}
export class ParticipantDto {
  userId: number;
  email: string;
}