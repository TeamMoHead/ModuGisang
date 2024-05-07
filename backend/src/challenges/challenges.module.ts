import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenges } from './challenges.entity';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { InvitationsModule } from 'src/invitations/invitations.module';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Challenges]),
    InvitationsModule,
    UserModule,
    AttendanceModule,
  ],
  providers: [ChallengesService],
  controllers: [ChallengesController],
  exports: [ChallengesService, TypeOrmModule],
})
export class ChallengesModule {}
