import { Injectable } from '@nestjs/common';
import { Invitations } from './invitations.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitations)
    private invitationRepository: Repository<Invitations>,
  ) {
    this.invitationRepository = invitationRepository;
  }
  async createInvitation(challengeId, userId): Promise<Invitations> {
    const newInvitation = new Invitations();
    newInvitation.challengeId = challengeId;
    newInvitation.guestId = userId;
    newInvitation.isExpired = false;
    newInvitation.sendDate = new Date();
    newInvitation.responseDate = null;
    return await this.invitationRepository.save(newInvitation);
  }
}
