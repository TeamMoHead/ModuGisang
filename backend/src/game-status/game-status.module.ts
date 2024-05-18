import { Module } from '@nestjs/common';
import { GameStatusGateway } from './game-status.gateway';
import { RedisAppModule } from 'src/redis-cache/redis-cache.module';

@Module({
  imports: [RedisAppModule],
  providers: [GameStatusGateway],
})
export class GameStatusModule {}
