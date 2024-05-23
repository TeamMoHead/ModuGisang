import { IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MedalsDto {
  @IsInt()
  gold: number;

  @IsInt()
  silver: number;

  @IsInt()
  bronze: number;
}

export class UserInformationDto {
  @IsString()
  userId: string;

  @IsString()
  userName: string;

  @IsInt()
  streakDays: number;

  @ValidateNested()
  @Type(() => MedalsDto)
  medals: MedalsDto;

  @IsInt()
  invitationCounts: number;

  @IsString()
  affirmation: string;

  @IsString()
  challengeId: string;

  @IsString()
  profile: string;

  @IsString()
  openviduToken: string;
}
