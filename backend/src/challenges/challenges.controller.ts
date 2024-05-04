import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/createChallenge.dto';

@Controller('api/challenge')
export class ChallengesController {
    constructor(
        private readonly challengeService:ChallengesService,
    ){}
    @Get()
    getChallengeInfo(){
        return 'challengeInfo';
    }
    @Post('create')
    async createChallenge(@Body() createChallengeDto:CreateChallengeDto) {
        console.log("create")
        console.log(createChallengeDto)
        const challenge = await this.challengeService.createChallenge(createChallengeDto);
        const challenge_id = await this.challengeService.hostChallengeStatus(createChallengeDto.hostId);
        for (let i = 0; i < createChallengeDto.miracleMates.length; i++) {
            const send = await this.challengeService.sendInvitation(challenge_id, createChallengeDto.miracleMates[i]);
        }
        return 'create';
    }
    @Get('searchmate')
    searchMate() {
        return 'searchMate';
    }
    @Get('invitations')
    getInvitations() {
        return 'Invitation challenge list';
    }
    @Post('acceptInvitation')
    acceptInvitation() {
        return 'accept';
    }
}
