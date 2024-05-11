import { Injectable } from '@nestjs/common';
import RedisCacheService from 'src/redis-cache/redis-cache.service';

@Injectable()
export class InGameService {
  constructor(private redisService: RedisCacheService) {}

  async recordEntryTime(userId: number) {
    const timestamp = Date.now().toString();
    await this.redisService.set(`entryTime:${userId}`, timestamp, 180);
    return true;
  }
}
