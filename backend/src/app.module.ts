import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenviduModule } from './openvidu/openvidu.module';
import { OpenviduController } from './openvidu/openvidu.controller';
import { OpenviduService } from './openvidu/openvidu.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [OpenviduModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env'
  })],
  controllers: [AppController,OpenviduController],
  providers: [AppService,OpenviduService],
})
export class AppModule {}
