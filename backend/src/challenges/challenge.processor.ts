import { Process, Processor } from '@nestjs/bull';
import { ChallengesService } from './challenges.service';

@Processor('challenge') // 큐 이름과 일치해야 함
export class ChallengeProcessor {
  constructor(private readonly challengeService: ChallengesService) {}

  @Process('processChallenge')
  async handleChallengeJob(job: any) {
    const { challengeId } = job.data;
    console.log(`Processing challenge ${challengeId}...`);
    try {
      const result =
        await this.challengeService.serverCompleteChallenge(challengeId);
      console.log(`Challenge ${challengeId} processing result:`, result);
    } catch (error) {
      console.error(
        `Error processing challenge ${challengeId}:`,
        error.message,
      );
    }
    //console.log('job  ', job);
    console.log('current time', new Date());

    // 종료 처리 로직 (DB 업데이트 등)
  }
}
