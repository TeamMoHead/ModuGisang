import { Process, Processor } from '@nestjs/bull';

@Processor('challenge') // 큐 이름과 일치해야 함
export class ChallengeProcessor {
  @Process('processChallenge')
  async handleChallengeJob(job: any) {
    const { challengeId } = job.data;
    console.log(`Processing challenge ${challengeId}...`);
    // 종료 처리 로직 (DB 업데이트 등)
  }
}
