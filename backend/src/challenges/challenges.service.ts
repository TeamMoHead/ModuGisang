import { Injectable } from '@nestjs/common';
import { Challenges } from './challenges.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { InvitationsService } from 'src/invitations/invitations.service';
import { Users } from 'src/users/entities/users.entity';
import { AcceptInvitationDto } from './dto/acceptInvitaion.dto';

@Injectable()
export class ChallengesService {
    constructor(
        @InjectRepository(Challenges)
        private challengeRepository: Repository<Challenges>,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>
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
    
    async searchAvailableMate(email:string):Promise<boolean>{
        const availUser = await this.usersRepository.findOne({
            where:{email:email}
        });
        console.log(availUser);
        if (availUser.challengeId > 0){
            return true;
        }else{
            return false;
        }
    }

    async acceptInvitation(invitation: AcceptInvitationDto){
        const challengeId = invitation.challengeId;
        const guestId = invitation.guestId;
        return await this.usersRepository.update({_id:guestId},{
            challengeId:challengeId
        });

    }

}