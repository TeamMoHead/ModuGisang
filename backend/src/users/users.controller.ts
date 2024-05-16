import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Res,
  Param,
  BadRequestException,
  Query,
  Get,
  Req,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthenticateGuard } from 'src/auth/auth.guard';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log('come here');
    console.log(createUserDto);
    const user = await this.userService.createUser(
      createUserDto.email,
      createUserDto.password,
      createUserDto.userName,
    );
    return user;
  }

  @UseGuards(AuthenticateGuard)
  @Get('me')
  async myData(@Req() req) {
    console.log(req.user);
    console.log('typeof req.user._id', typeof req.user._id);
    const result = await this.userService.getInvis(req.user._id);
    console.log(req.user._id);
    const invitations = result.invitations;
    return {
      userId: invitations._id,
      userName: invitations.userName,
      streakDays: 0, // streak 구현 후 처리 예정
      medals: {
        gold: invitations.medals.gold,
        silver: invitations.medals.silver,
        bronze: invitations.medals.bronze,
      },
      invitationCounts: result.count,
      affirmation: invitations.affirmation,
      challengeId: invitations.challengeId,
      profile: invitations.profile,
    };
  }

  @UseGuards(AuthenticateGuard)
  @Get('/:userId')
  async searchUser(@Param('userId') userId: number) {
    const result = await this.userService.getInvis(userId);
    const invitations = result.invitations;
    return {
      userId: invitations._id,
      userName: invitations.userName,
      streakDays: result.currentStreak, // streak 구현 후 처리 예정
      medals: {
        gold: invitations.medals.gold,
        silver: invitations.medals.silver,
        bronze: invitations.medals.bronze,
      },
      invitationCounts: result.count,
      affirmation: invitations.affirmation,
      challengeId: invitations.challengeId,
      profile: invitations.profile,
    };
  }

  @Post('/:userId/update-affirm')
  async updateAffirm(
    @Param('userId') userId: number,
    @Body('affirmation') affirmation: string,
  ) {
    if (affirmation === '') {
      throw new BadRequestException('격언 값이 없습니다.');
    }
    const user = await this.userService.findOneByID(userId);
    const result = await this.userService.updateAffirm(user, affirmation);
    if (result.affected > 0) {
      return 'success';
    } else {
      throw new BadRequestException('격언 업로드 실패!');
    }
  }
}
