import { Controller, Get, Post } from '@nestjs/common';

@Controller('api/challenge')
export class ChallengesController {
    @Get()
    getChallengeInfo(){
        return 'challengeInfo';
    }
    @Post('create')
    createChallenge() {
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
