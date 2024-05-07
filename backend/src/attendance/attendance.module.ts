import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenges } from 'src/challenges/challenges.entity';
import { Attendance } from './attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance])],
  providers: [AttendanceService],
  controllers: [AttendanceController],
  exports: [AttendanceService, TypeOrmModule],
})
export class AttendanceModule {}
