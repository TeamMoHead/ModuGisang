import { Injectable } from '@nestjs/common';
import { Challenges } from './challenges.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { InvitationsService } from 'src/invitations/invitations.service';

@Injectable()
export class ChallengesService {
    constructor(
        @InjectRepository(Challenges)
        private challengeRepository: Repository<Challenges>,
    ){
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
    

}
