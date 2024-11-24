import { Module, Global } from '@nestjs/common';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 환경 변수를 사용할 경우
import { ChallengeProcessor } from 'src/challenges/challenge.processor';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { BullController } from './bull.controller';
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
    BullBoardModule.forFeature({
      name: 'challenge',
      adapter: BullAdapter, //or use BullAdapter if you're using bull instead of bullMQ
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter, // Or FastifyAdapter from `@bull-board/fastify`
    }),
  ],
  controllers: [BullController],
  providers: [ChallengeProcessor],
})
export class BullAppModule {}
