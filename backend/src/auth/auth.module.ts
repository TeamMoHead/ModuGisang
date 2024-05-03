import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/users/users.module';
// import { jwtConstants } from './constants';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import RedisCacheService from 'src/redis-cache/redis-cache.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UsersEntity]),
    PassportModule.register({}),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
        signOptions: { expiresIn: configService.get<string>('ACCESS_TOKEN_EXP') },
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, JwtRefreshStrategy, RedisCacheService]
})
export class AuthModule { }