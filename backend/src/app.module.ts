import { Module, Post } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenviduModule } from './openvidu/openvidu.module';
import { OpenviduController } from './openvidu/openvidu.controller';
import { OpenviduService } from './openvidu/openvidu.service';
import { ConfigModule ,ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { CacheModule } from '@nestjs/cache-manager';
import { RedisCacheService } from './redis-cache/redis-cache.service';
import { RedisCacheController } from './redis-cache/redis-cache.controller';
import { EmailController } from './email/email.controller';
import { EmailService } from './email/email.service';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import * as redisStore from 'cache-manager-ioredis';
import * as fs from 'fs';
import { Users } from './users/entities/users.entity';
// import { AuthService } from './auth/auth.service';
// import { AuthController } from './auth/auth.controller';
// import { JwtModule } from '@nestjs/jwt';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { ChallengesModule } from './challenges/challenges.module';
import { InvitationsModule } from './invitations/invitations.module';
import { AttendanceModule } from './attendance/attendance.module';
import { Attendance } from './attendance/attendance.entity';
import { Challenges } from './challenges/challenges.entity';
import { Invitations } from './invitations/invitations.entity';
import { Streak } from './users/entities/streak.entity';


@Module({
  imports: [
    OpenviduModule, ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production',
      //ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //   isGlobal: true,
    //   store: redisStore,
    //   host: configService.get<string>('REDIS_HOST'),
    //   port: configService.get<number>('REDIS_PORT'),
    //   }),
    // }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => {
        return {
          type: 'single',  // Redis 연결 타입 지정
          url: configService.get<string>('REDIS_URL'),  // 환경 변수에서 Redis URL을 가져옵니다.
        };
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRESQL_DATABASE_HOST'),
        port: configService.get<number>('POSTGRESQL_DATABASE_PORT'),
        username: configService.get<string>('POSTGRESQL_DATABASE_USER'),
        database: configService.get<string>('POSTGRESQL_DATABASE_NAME'),
        password: configService.get<string>('POSTGRESQL_DATABASE_PASSWORD'),
        logging : true,
    
        synchronize: true,//테이블을 자동으로 생성해주는 옵션 , 실제 환경에서는 사용하지 않는 것이 좋다.
        entities: [Users, Attendance, Challenges, Invitations, Streak], // 여기에 엔티티 클래스를 추가합니다. 
        // ssl: {
        // // 다운로드한 인증서 파일 경로 추가
        //   ca: fs.readFileSync("././global-bundle.pem")
        // },
        // extra: {
        // // SSL 연결을 강제 설정
        //   ssl: { rejectUnauthorized: false },
        // },
        ssl: process.env.NODE_ENV === 'development' ? undefined :{
          ca: fs.readFileSync("././global-bundle.pem")
        },
    
        extra: process.env.NODE_ENV === 'development' ? undefined: {
          ssl: { rejectUnauthorized: false },
        },
      }),
      inject: [ConfigService],
    }),

    UserModule,
    AuthModule,
    ChallengesModule,
    InvitationsModule,
    AttendanceModule,
  ],
  controllers: [AppController, RedisCacheController, OpenviduController, EmailController],
  providers: [AppService, RedisCacheService, OpenviduService, EmailService],
})
export class AppModule {
}
