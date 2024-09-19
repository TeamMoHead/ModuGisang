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
  ParseIntPipe,
  NotFoundException,
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
      openviduToken: invitations.openviduToken,
    };
  }

  @UseGuards(AuthenticateGuard)
  @Get('/:userId')
  async searchUser(@Req() req, @Param('userId', ParseIntPipe) userId: number) {
    const redisCheckUserInfo = await this.userService.redisCheckUser(userId);
    if (redisCheckUserInfo) {
      return redisCheckUserInfo;
    } else {
      const result = await this.userService.getInvis(userId);
      const invitations = result.invitations;
      const lastActiveDate = result.lastActiveDate;
      const isCountinue = this.userService.isContinuous(lastActiveDate);

      const userInformation = {
        userId: invitations._id,
        userName: invitations.userName,
        streakDays: isCountinue ? result.currentStreak : 0,
        medals: {
          gold: invitations.medals.gold,
          silver: invitations.medals.silver,
          bronze: invitations.medals.bronze,
        },
        invitationCounts: result.count,
        affirmation: invitations.affirmation,
        challengeId: invitations.challengeId,
        profile: invitations.profile,
        openviduToken: invitations.openviduToken,
      };

      await this.userService.redisSetUser(userId, userInformation);
      return userInformation;
    }
  }

  @UseGuards(AuthenticateGuard)
  @Post('/:userId/update-affirm')
  async updateAffirm(
    @Param('userId') userId: number,
    @Body('affirmation') affirmation: string,
  ) {
    if (affirmation === '') {
      throw new BadRequestException('확언 값이 없습니다.');
    }
    const user = await this.userService.findOneByID(userId);
    const result = await this.userService.updateAffirm(user, affirmation);
    if (result.affected > 0) {
      return 'success';
    } else {
      throw new BadRequestException('확언 업로드 실패!');
    }
  }

  // 계정 삭제 API
  @Post('delete-user')
  async deleteUser(@Body('userId') userId: number) {
    const result = await this.userService.deleteUser(userId);
    if (result === 1) {
      return { status: 201, message: '회원 삭제 성공' };
    } else {
      return { status: 401, message: '회원 삭제 실패' };
    }
  }

  // 계정 복구 API
  @Get('restore/:id')
  async restoreUser(@Param('id') id: number): Promise<void> {
    return this.userService.restoreUser(id);
  }

  // 비밀번호 변경 API
  @UseGuards(AuthenticateGuard)
  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; newPassword: string }) {
    const { email, newPassword } = body;
    const user = await this.userService.findUser(email);
    console.log('user ', user);
    if (!user) {
      throw new NotFoundException('해당 이메일을 가진 유저는 없습니다.');
    }
    const hashedPassword = await this.userService.changePassword(
      user._id,
      newPassword,
    );
    if (hashedPassword.affected === 1) {
      return { status: 201, message: '비밀번호 변경 성공' };
    } else {
      return { status: 401, message: '비밀번호 변경 실패' };
    }
  }
}
