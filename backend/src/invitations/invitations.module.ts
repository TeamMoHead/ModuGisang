import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { Invitations } from './invitations.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Invitations])],
  providers: [InvitationsService],
  controllers: [InvitationsController],
  exports: [InvitationsService, TypeOrmModule.forFeature([Invitations])],
})
export class InvitationsModule {}
