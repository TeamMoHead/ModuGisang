import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Attendance } from 'src/attendance/attendance.entity';
import { Challenges } from 'src/challenges/challenges.entity';
import { Invitations } from 'src/invitations/invitations.entity';
import { Streak } from 'src/users/entities/streak.entity';
import { Users } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRESQL_DATABASE_HOST'),
        port: configService.get<number>('POSTGRESQL_DATABASE_PORT'),
        username: configService.get<string>('POSTGRESQL_DATABASE_USER'),
        database: configService.get<string>('POSTGRESQL_DATABASE_NAME'),
        password: configService.get<string>('POSTGRESQL_DATABASE_PASSWORD'),
        logging: true,

        synchronize: process.env.NODE_ENV !== 'production',
        entities: [Users, Attendance, Challenges, Invitations, Streak],

        ssl:
          process.env.NODE_ENV === 'development'
            ? undefined
            : {
                ca: fs.readFileSync('././global-bundle.pem'),
              },

        extra:
          process.env.NODE_ENV === 'development'
            ? undefined
            : {
                ssl: { rejectUnauthorized: false },
              },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
