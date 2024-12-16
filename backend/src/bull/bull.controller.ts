import { Controller, Get } from '@nestjs/common';
import { ChallengeQueueService } from '../challenges/challenge-queue.service';
@Controller('bull')
export class BullController {
  constructor(private readonly challengeQueueService: ChallengeQueueService) {}

  @Get('status')
  async getQueueStatus() {
    return this.challengeQueueService.getQueueStatus();
  }
}
