import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenges } from './challenges.entity';
import { InvitationsModule } from 'src/invitations/invitations.module';
import { UserModule } from 'src/users/users.module';
import { Users } from 'src/users/entities/users.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Challenges]),InvitationsModule, UserModule],
  providers: [ChallengesService],
  controllers: [ChallengesController],
  exports:[ChallengesService, TypeOrmModule]
})
export class ChallengesModule {}
