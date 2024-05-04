import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { Streak } from './entities/streak.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Users, Streak])],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService, TypeOrmModule]
})
export class UserModule {}