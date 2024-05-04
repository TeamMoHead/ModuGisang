import { Injectable } from '@nestjs/common';
import { Challenges } from './challenges.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { InvitationsService } from 'src/invitations/invitations.service';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class ChallengesService {
    constructor(
        @InjectRepository(Challenges)
        private challengeRepository: Repository<Challenges>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        private invitationService: InvitationsService,
    ) {
        this.challengeRepository = challengeRepository;
    }

    async createChallenge(challenge: CreateChallengeDto): Promise<Challenges> {
        const newChallenge = new Challenges();
        newChallenge.hostId = challenge.hostId;
        newChallenge.startDate = challenge.startDate;
        newChallenge.wakeTime = challenge.wakeTime;
        newChallenge.durationDays = challenge.duration;
        return await this.challengeRepository.save(challenge);
    }

    async hostChallengeStatus(hostId: number): Promise<number>{
        const challengeId = await this.challengeRepository.findOne({ where: { hostId } });
        const user = await this.userRepository.findOneBy({ _id : hostId  });
        if (user && challengeId) {
            user.challengeId = challengeId._id;
            await this.userRepository.save(user);
            return challengeId._id;
        }
        return null;
    }
    async sendInvitation(challengeId: number, email: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { email : email } });
        await this.invitationService.createInvitation(challengeId, user._id);
    }


}
