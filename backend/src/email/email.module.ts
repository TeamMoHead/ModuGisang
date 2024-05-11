import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { UserModule } from 'src/users/users.module';
import { RedisAppModule } from 'src/redis-cache/redis-cache.module';

@Module({
  imports: [
    UserModule, // UserService를 포함하는 UserModule을 임포트
    RedisAppModule, // RedisCacheService를 포함하는 RedisCacheModule을 임포트
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
