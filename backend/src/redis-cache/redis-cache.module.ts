import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { RedisCacheController } from './redis-cache.controller';
import RedisCacheService from './redis-cache.service';

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => {
        return {
          type: 'single', // Redis 연결 타입 지정
          url: configService.get<string>('REDIS_URL'), // 환경 변수에서 Redis URL을 가져옵니다.
        };
      },
    }),
  ],
  exports: [RedisModule, RedisCacheService],
  controllers: [RedisCacheController],
  providers: [RedisCacheService],
})
export class RedisAppModule {}
