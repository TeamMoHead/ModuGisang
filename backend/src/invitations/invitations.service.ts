import { Injectable } from '@nestjs/common';
import { Invitations } from './invitations.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import RedisCacheService from 'src/redis-cache/redis-cache.service';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly redisService: RedisCacheService,
    @InjectRepository(Invitations)
    private invitationRepository: Repository<Invitations>,
  ) {
    this.invitationRepository = invitationRepository;
  }
  async createInvitation(challengeId, userId): Promise<Invitations> {
    this.redisService.del(`userInfo:${userId}`);
    const newInvitation = new Invitations();
    newInvitation.challengeId = challengeId;
    newInvitation.guestId = userId;
    newInvitation.isExpired = false;
    newInvitation.sendDate = new Date();
    newInvitation.responseDate = null;
    return await this.invitationRepository.save(newInvitation);
  }
}
