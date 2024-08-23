import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { AuthenticateGuard } from 'src/auth/auth.guard';
import { AcceptInvitationDto } from './dto/acceptInvitaion.dto';
import { ChallengeResponseDto } from './dto/challengeResponse.dto';
import { ChallengeResultDto } from './dto/challengeResult.dto';
import RedisCacheService from 'src/redis-cache/redis-cache.service';
import { EditChallengeDto } from './dto/editChallenge.dto';

@UseGuards(AuthenticateGuard)
@Controller('api/challenge')
export class ChallengesController {
  constructor(
    private readonly challengeService: ChallengesService,
    private readonly redisService: RedisCacheService,
  ) {}
  @Get()
  async getChallengeInfo(
    @Query('challengeId') challengeId: number,
  ): Promise<ChallengeResponseDto> {
    const challenge = await this.challengeService.getChallengeInfo(challengeId);
    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${challengeId} not found`);
    }
    return challenge;
  }
  @Post('create')
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    console.log('create');
    console.log(createChallengeDto);
    const challenge =
      await this.challengeService.createChallenge(createChallengeDto);

    const challenge_id = await this.challengeService.hostChallengeStatus(
      createChallengeDto.hostId,
    );

    for (let i = 0; i < createChallengeDto.mates.length; i++) {
      const send = await this.challengeService.sendInvitation(
        challenge_id,
        createChallengeDto.mates[i],
      );
    }
    this.redisService.del(`userInfo:${createChallengeDto.hostId}`);
    return 'create';
  }
  @Post('edit')
  async editChallenge(@Body() editChallengeDto: EditChallengeDto) {
    console.log('edit');
    const challenge =
      await this.challengeService.editChallenge(editChallengeDto);
    return challenge;
  }
  @Post('delete/:challengeId/:hostId') // 챌린지 생성하고 시작하지 않고 삭제하는 경우
  async deleteChallenge(
    @Param('challengeId') challengeId: number,
    @Param('hostId') hostId: number,
  ) {
    console.log(challengeId);
    const challenge = await this.challengeService.deleteChallenge(
      challengeId,
      hostId,
    );
    return challenge;
  }

  // 로컬에 저장한 챌린지 값으로 현재 날짜랑 챌린지 날짜 비교해서 넘은 경우만 호출
  @Post('complete/:challengeId/:userId') // 챌린지가 끝났는지 확인하는 경우
  async checkChallenge(
    @Param('challengeId') challengeId: number,
    @Param('userId') userId: number,
  ) {
    const result = await this.challengeService.completeChallenge(
      challengeId,
      userId,
    );
    if (result === true) {
      return {
        expired: true,
        message:
          'This challenge has expired and user data has been successfully updated.',
      };
    } else {
      return {
        expired: false,
        message: 'This challenge is not expired yet.',
      };
    }
  }

  @Get('search-mate')
  async searchMate(@Query('email') email: string) {
    const result = await this.challengeService.searchAvailableMate(email);
    return {
      isEngaged: result,
    };
  }
  @Get('invitations')
  getInvitations(@Query('guestId') guestId: number) {
    console.log(guestId);
    const invitations = this.challengeService.getInvitations(guestId);
    return invitations; // 데이터 반환 값 수정 예정
  }
  @Post('accept-invitation')
  async acceptInvitation(@Body() acceptInvitationDto: AcceptInvitationDto) {
    const result =
      await this.challengeService.acceptInvitation(acceptInvitationDto);
    if (result.success === true) {
      return 'accept';
    } else {
      throw new BadRequestException('승낙 실패');
    }
  }

  @Get('calendar/:userId/:month')
  async getChallengeCalendar(
    @Param('userId') userId: number,
    @Param('month') month: number,
  ): Promise<string[]> {
    return this.challengeService.getChallengeCalendar(userId, month);
  }

  @Get('/:userId/results/:date')
  async getChallengeResults(
    @Param('userId') userId: number,
    @Param('date') date: Date,
  ): Promise<ChallengeResultDto[]> {
    try {
      const result = await this.challengeService.getResultsByDateAndUser(
        userId,
        date,
      );
      return result;
    } catch (error) {
      if (error.message === 'Attendance does not exist') {
        throw new NotFoundException(
          'No attendance records found for the given user and date',
        );
      }
      if (error.message === 'No challenge found for the user.') {
        throw new NotFoundException('No challenge found for the given user');
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
  @Post('/changeWakeTime')
  async setChallengeWakeTime(@Body() setChallengeWakeTimeDto): Promise<void> {
    console.log('기상시간 변경완료');
    console.log(setChallengeWakeTimeDto);
    try {
      await this.challengeService.setWakeTime(setChallengeWakeTimeDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
