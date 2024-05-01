import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenviduModule } from './openvidu/openvidu.module';
import { OpenviduController } from './openvidu/openvidu.controller';
import { OpenviduService } from './openvidu/openvidu.service';

@Module({
  imports: [OpenviduModule],
  controllers: [AppController,OpenviduController],
  providers: [AppService,OpenviduService],
})
export class AppModule {}
