import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ChallengeQueueService {
  constructor(@InjectQueue('challenge') private challengeQueue: Queue) {}

  async addChallengeToQueue(challengeId: number, wakeTime: Date) {
    const currentTime = new Date();
    const delay = wakeTime.getTime() - currentTime.getTime();

    if (delay > 0) {
      // 지정된 시간에 작업을 실행하도록 큐에 추가
      await this.challengeQueue.add(
        'processChallenge',
        { challengeId },
        { delay },
      );
    } else {
      console.warn(
        `Challenge ${challengeId}의 wakeTime ${wakeTime}이 이미 지났습니다.`,
      );
    }
  }
}
