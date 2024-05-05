import { BadRequestException, Body, Controller, Get, NotFoundException, NotImplementedException, Post, Query, UseGuards } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { AuthenticateGuard } from 'src/auth/auth.guard';
import { AcceptInvitationDto } from './dto/acceptInvitaion.dto';
import { ChallengeResponseDto } from './dto/challengeResponse.dto';

@Controller('api/challenge')
export class ChallengesController {
    constructor(
        private readonly challengeService:ChallengesService,
    ){}
    @Get()
    async getChallengeInfo(@Query('challengeId') challengeId: number): Promise<ChallengeResponseDto> {
        const challenge = await this.challengeService.getChallengeInfo(challengeId);
        if (!challenge) {
          throw new NotFoundException(`Challenge with ID ${challengeId} not found`);
        }
        return challenge;
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
    async searchMate(@Body('email') email:string){
        const result = await this.challengeService.searchAvailableMate(email);
        return {
            isEngaged: result
        }
    }
    @Get('invitations')
    getInvitations() {
        return 'Invitation challenge list';
    }
    @Post('acceptInvitation')
    async acceptInvitation(@Body() acceptInvitationDto:AcceptInvitationDto) {
        const result = await this.challengeService.acceptInvitation(acceptInvitationDto);
        if(result.affected > 0){
            return 'accept';
        }else{
            throw new BadRequestException("승낙 실패");
        }
        
    }
}
