import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ChallengeQueueService {
  constructor(@InjectQueue('challenge') private challengeQueue: Queue) {}

  async addChallengeToQueue(challengeId: number, wakeTime: string) {
    const currentTime = new Date();

    // wakeTime을 오늘 날짜를 기준으로 한 Date 객체로 변환
    const [hours, minutes, seconds] = wakeTime.split(':').map(Number);
    const wakeTimeDate = new Date();
    wakeTimeDate.setHours(hours, minutes, seconds, 0);

    const delay = wakeTimeDate.getTime() - currentTime.getTime();
    console.log(`Challenge ${challengeId}의 wakeTime: ${wakeTime}`);
    console.log(`Challenge ${challengeId}의 delay: ${delay}`);
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
  async getQueueStatus() {
    const jobCounts = await this.challengeQueue.getJobCounts();
    const delayedCount = await this.challengeQueue.getDelayedCount();
    const completedCount = await this.challengeQueue.getCompletedCount();
    const failedCount = await this.challengeQueue.getFailedCount();

    return {
      waiting: jobCounts.waiting, // 대기 중인 작업의 수
      active: jobCounts.active, // 활성화된 작업의 수
      completed: completedCount, // 완료된 작업의 수
      failed: failedCount, // 실패한 작업의 수
      delayed: delayedCount, // 지연된 작업의 수
      totalJobs:
        jobCounts.waiting +
        jobCounts.active +
        completedCount +
        failedCount +
        delayedCount, // 전체 작업의 수
    };
  }
}
