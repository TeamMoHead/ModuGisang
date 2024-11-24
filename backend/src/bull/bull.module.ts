import { Module, Global } from '@nestjs/common';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 환경 변수를 사용할 경우
import { ChallengeProcessor } from 'src/challenges/challenge.processor';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule], // ConfigModule을 사용하는 경우
      inject: [ConfigService], // ConfigService를 통해 Redis 설정을 로드
      useFactory: async (
        configService: ConfigService,
      ): Promise<BullModuleOptions> => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'), // 기본값 'localhost'
          port: configService.get<number>('REDIS_PORT'), // 기본값 6379
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'challenge', // 큐 이름
    }),
  ],
  providers: [ChallengeProcessor],
})
export class BullAppModule {}
