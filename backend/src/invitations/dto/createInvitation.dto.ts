import {
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDate,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvitationDto {
  @IsNotEmpty()
  @IsInt()
  challengeId: number;

  @IsNotEmpty()
  @IsInt()
  guestId: number;

  @IsNotEmpty()
  @IsBoolean()
  isExpired: boolean;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  sendDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  responseDate?: Date;
}
