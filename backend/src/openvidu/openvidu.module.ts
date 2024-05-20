import { Module } from '@nestjs/common';
import { OpenviduService } from './openvidu.service';
import { OpenviduController } from './openvidu.controller';
import { UserService } from 'src/users/users.service';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [UserModule],
  providers: [OpenviduService],
  controllers: [OpenviduController],
})
export class OpenviduModule {}
