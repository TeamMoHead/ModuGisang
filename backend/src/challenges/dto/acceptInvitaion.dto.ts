import { IsNotEmpty, IsNumber } from 'class-validator';

export class AcceptInvitationDto {
  @IsNotEmpty()
  @IsNumber()
  challengeId: number;

  @IsNotEmpty()
  @IsNumber()
  guestId: number;
}
