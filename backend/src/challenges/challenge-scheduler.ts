import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Challenges } from './challenges.entity';
import { ChallengeQueueService } from './challenge-queue.service';
import { ChallengesService } from './challenges.service';
import * as moment from 'moment-timezone';
@Injectable()
export class ChallengeScheduler {
  constructor(
    private readonly challengeService: ChallengesService,
    private readonly challengeQueueService: ChallengeQueueService,
  ) {}
  private readonly logger = new Logger(ChallengeScheduler.name);
  // 매일 자정에 실행
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleChallengeEnd() {
    const date = moment().tz('Asia/Seoul');

    this.logger.log(
      '자정이 되었습니다... ' + date.format('YYYY-MM-DD HH:mm:ss'),
    );
    console.log('자정이 되었습니다... ', date.format('YYYY-MM-DD HH:mm:ss'));

    const challenges = await this.challengeService.findEndingToday();

    console.log('오늘 종료되는 챌린지 목록: ', challenges);
    this.logger.log('오늘 종료되는 챌린지 목록: ', challenges);

    for (const challenge of challenges) {
      // 챌린지의 wakeTime에 작업을 등록
      await this.challengeQueueService.addChallengeToQueue(
        challenge._id,
        challenge.wakeTime.toString(),
      );
    }
  }
}
