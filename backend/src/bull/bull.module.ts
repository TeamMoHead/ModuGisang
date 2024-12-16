import { Module, Global, forwardRef } from '@nestjs/common';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 환경 변수를 사용할 경우
import { ChallengeProcessor } from 'src/challenges/challenge.processor';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { BullController } from './bull.controller';
import { ChallengeQueueService } from 'src/challenges/challenge-queue.service';
import { ChallengesModule } from 'src/challenges/challenges.module';
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
    ...(process.env.NODE_ENV !== 'production'
      ? [
          BullBoardModule.forFeature({
            name: 'challenge',
            adapter: BullAdapter,
          }),
          BullBoardModule.forRoot({
            route: '/bull-board',
            adapter: ExpressAdapter,
          }),
        ]
      : []),
    forwardRef(() => ChallengesModule), // forwardRef로 참조
  ],
  controllers: [BullController],
  providers: [ChallengeProcessor, ChallengeQueueService],
  exports: [ChallengeQueueService], // 추가: ChallengeQueueService를 export
})
export class BullAppModule {}
