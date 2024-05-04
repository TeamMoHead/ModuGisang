import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenges } from './challenges.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Challenges])],
  providers: [ChallengesService],
  controllers: [ChallengesController],
  exports:[ChallengesService, TypeOrmModule]
})
export class ChallengesModule {}
