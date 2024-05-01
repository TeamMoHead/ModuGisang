import { Module } from '@nestjs/common';
import { OpenviduService } from './openvidu.service';
import { OpenviduController } from './openvidu.controller';

@Module({
  providers: [OpenviduService],
  controllers: [OpenviduController]
})
export class OpenviduModule {}
