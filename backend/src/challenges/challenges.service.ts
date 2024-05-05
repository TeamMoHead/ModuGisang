import { Injectable } from '@nestjs/common';
import { Challenges } from './challenges.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder } from 'typeorm';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { InvitationsService } from 'src/invitations/invitations.service';
import { Users } from 'src/users/entities/users.entity';
import { AcceptInvitationDto } from './dto/acceptInvitaion.dto';
import { ChallengeResponseDto, ParticipantDto } from './dto/challengeResponse.dto';

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
    
    async searchAvailableMate(email:string):Promise<boolean>{
        const availUser = await this.userRepository.findOne({
            where:{email:email}
        });
        if (availUser.challengeId > 0){
            return true;
        }else{
            return false;
        }
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


    async acceptInvitation(invitation: AcceptInvitationDto){
        const challengeId = invitation.challengeId;
        const guestId = invitation.guestId;
        return await this.userRepository.update({_id:guestId},{
            challengeId:challengeId
        });

    }

    async getChallengeInfo(challengeId: number): Promise<ChallengeResponseDto | null> {
        // 먼저 챌린지 정보를 가져옵니다.
        const challenge = await this.challengeRepository.findOne({
            where: { _id: challengeId }
        });
        if (!challenge) {
            return null; // 챌린지가 없으면 null 반환
        }

        // 해당 챌린지 ID를 가진 모든 사용자 검색
        const participants = await this.userRepository.find({
            where: { challengeId: challenge._id }
        });

        // 참가자 정보를 DTO 형식으로 변환
        const participantDtos: ParticipantDto[] = participants.map(user => ({
            userId: user._id,
            email: user.email
        }));
        
        return {
            _id: challenge._id,
            startDate: challenge.startDate,
            wakeTime: challenge.wakeTime,
            durationDays: challenge.durationDays,
            mates: participantDtos
        };
    }

}