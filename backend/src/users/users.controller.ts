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
    const user = await this.userService.createUser(
      createUserDto.email,
      createUserDto.password,
      createUserDto.userName,
    );
    if (user) {
      return user;
    } else {
      throw new BadRequestException('회원가입 실패');
    }
  }

  @UseGuards(AuthenticateGuard)
  @Get('me')
  async myData(@Req() req) {
    console.log(req.user);
    console.log('typeof req.user._id', typeof req.user._id);
    const result = await this.userService.getInvis(req.user._id);
    if (result) {
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
    } else {
      throw new BadRequestException('회원 정보 찾기 실패');
    }
  }

  @UseGuards(AuthenticateGuard)
  @Get('/:userId')
  async searchUser(@Req() req, @Param('userId', ParseIntPipe) userId: number) {
    const redisCheckUserInfo = await this.userService.redisCheckUser(userId);
    if (redisCheckUserInfo) {
      return redisCheckUserInfo;
    } else {
      const result = await this.userService.getInvis(userId);
      if (result) {
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
      } else {
        throw new BadRequestException('유저 정보 찾기 실패');
      }
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
  @UseGuards(AuthenticateGuard)
  @Post('delete-user')
  async deleteUser(@Body('password') password: string, @Req() req) {
    // 유저 확인
    const user = await this.userService.checkUser(req.user.email, password);
    // 삭제 진행
    const result = await this.userService.deleteUser(user._id);
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
  async resetPassword(
    @Body() body: { newPassword: string; oldPassword: string },
    @Req() req,
  ) {
    const { newPassword, oldPassword } = body;
    const email = req.user.email;
    // 유저 이메일과 비밀번호로 유저 2차 검증 후 유저 정보 가져오기
    const user = await this.userService.checkUser(email, oldPassword);
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
