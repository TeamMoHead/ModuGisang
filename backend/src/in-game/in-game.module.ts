import { Module } from '@nestjs/common';
import { InGameService } from './in-game.service';
import { InGameController } from './in-game.controller';

@Module({
  controllers: [InGameController],
  providers: [InGameService],
})
export class InGameModule {}
