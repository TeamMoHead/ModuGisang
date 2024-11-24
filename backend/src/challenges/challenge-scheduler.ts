import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Challenges } from './challenges.entity';
import { ChallengeQueueService } from './challenge-queue.service';
import { ChallengesService } from './challenges.service';
@Injectable()
export class ChallengeScheduler {
  constructor(
    @InjectRepository(Challenges)
    private readonly challengeService: ChallengesService,
    private readonly challengeQueueService: ChallengeQueueService,
  ) {}

  // 매일 자정에 실행
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleChallengeEnd() {
    const challenges = await this.challengeService.findEndingToday();

    for (const challenge of challenges) {
      // 챌린지의 wakeTime에 작업을 등록
      await this.challengeQueueService.addChallengeToQueue(
        challenge._id,
        challenge.wakeTime,
      );
    }
  }
}
