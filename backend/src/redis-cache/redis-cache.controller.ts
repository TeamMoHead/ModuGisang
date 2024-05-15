import { Controller, Get, Post } from '@nestjs/common';
import RedisCacheService from './redis-cache.service';

@Controller('redis-cache')
export class RedisCacheController {
  constructor(private readonly redisService: RedisCacheService) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.redisService.get('hello');
  }

  @Post()
  async setHello(): Promise<void | string> {
    return await this.redisService.set('hello', 'world');
  }
}
