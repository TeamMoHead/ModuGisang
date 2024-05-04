import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenges } from './challenges.entity';
import { Users } from 'src/users/entities/users.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Challenges,Users])],
  providers: [ChallengesService],
  controllers: [ChallengesController],
  exports:[ChallengesService, TypeOrmModule]
})
export class ChallengesModule {}
