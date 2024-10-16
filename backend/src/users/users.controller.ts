import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Param,
  Query,
  Get,
  ParseIntPipe,
  Res,
  Req,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
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
    return user;
  }

  @UseGuards(AuthenticateGuard)
  @Get('me')
  async myData(@Req() req) {
    console.log(req.user);
    console.log('typeof req.user._id', typeof req.user._id);
    const userId = req.user._id;
    const user = await this.userService.findOneByID(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    const streaks = await this.userService.getCurrentStreak(userId);
    const invitations = await this.userService.getInviationsCount(userId);

    return {
      userId: user._id,
      userName: user.userName,
      streakDays: 0, // streak 구현 후 처리 예정
      medals: {
        gold: user.medals.gold,
        silver: user.medals.silver,
        bronze: user.medals.bronze,
      },
      invitationCounts: invitations.count,
      affirmation: user.affirmation,
      challengeId: user.challengeId,
      profile: user.profile,
      openviduToken: user.openviduToken,
    };
  }

  @UseGuards(AuthenticateGuard)
  @Get('/:userId')
  async searchUser(@Req() req, @Param('userId', ParseIntPipe) userId: number) {
    const redisCheckUserInfo = await this.userService.redisCheckUser(userId);
    if (redisCheckUserInfo) {
      return redisCheckUserInfo;
    } else {
      const user = await this.userService.findOneByID(userId);
      if (!user) {
        throw new NotFoundException('존재하지 않는 유저입니다.');
      }
      const streaks = await this.userService.getCurrentStreak(userId);
      if (!streaks) {
        throw new InternalServerErrorException(
          '스트릭을 가져오는데 오류가 발생했습니다.',
        );
      }

      const invitations = await this.userService.getInviationsCount(userId);
      if (!invitations) {
        throw new InternalServerErrorException(
          '초대장을 가져오는데 오류가 발생했습니다.',
        );
      }
      const lastActiveDate = streaks.lastActiveDate;
      const isCountinue = this.userService.isContinuous(lastActiveDate);

      const userInformation = {
        userId: user._id,
        userName: user.userName,
        streakDays: isCountinue ? streaks.currentStreak : 0,
        medals: {
          gold: user.medals.gold,
          silver: user.medals.silver,
          bronze: user.medals.bronze,
        },
        invitationCounts: invitations.count,
        affirmation: user.affirmation,
        challengeId: user.challengeId,
        profile: user.profile,
        openviduToken: user.openviduToken,
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
    @Res() res,
  ) {
    if (affirmation === '') {
      throw new BadRequestException('확언 값이 없습니다.');
    }
    const user = await this.userService.findOneByID(userId);
    const result = await this.userService.updateAffirm(user, affirmation);
    if (result.affected > 0) {
      return res.status(HttpStatus.OK).json({ suceess: true });
    } else {
      throw new InternalServerErrorException(
        '확언 업데이트 중 문제가 발생했습니다.',
      );
    }
  }

  // 계정 삭제 API
  @UseGuards(AuthenticateGuard)
  @Post('delete-user')
  async deleteUser(@Body('password') password: string, @Req() req, @Res() res) {
    if (!req.user) {
      throw new UnauthorizedException('인증되지 않은 유저입니다.');
    }

    const user = await this.userService.findOneByID(req.user._id);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    const passwordVerified = await this.userService.verifyUserPassword(
      user,
      password,
    );
    if (!passwordVerified) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    // 삭제 진행
    const deletedUserCount = await this.userService.deleteUser(user);
    if (deletedUserCount === 1) {
      return res.status(HttpStatus.OK).json({ suceess: true });
    } else {
      throw new InternalServerErrorException('회원 DB 삭제 실패');
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
    @Res() res,
  ) {
    const { newPassword, oldPassword } = body;

    // 유저 이메일과 비밀번호로 유저 2차 검증 후 유저 정보 가져오기
    const user = await this.userService.findUser(req.user.email);
    if (!user) {
      throw new NotFoundException('해당 유저가 없습니다.');
    }

    const isUserVerified = await this.userService.verifyUserPassword(
      user,
      oldPassword,
    );
    if (!isUserVerified) {
      throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
    }

    const verifyPWResult = this.userService.checkPWformat(newPassword);
    if (!verifyPWResult.success) {
      throw new BadRequestException(verifyPWResult.message);
    }

    const isPasswordChanged = await this.userService.changePassword(
      user._id,
      newPassword,
    );

    if (isPasswordChanged) {
      return res.status(HttpStatus.OK).json({ suceess: true });
    } else {
      throw new InternalServerErrorException(
        '비밀번호 변경 중 문제가 발생했습니다.',
      );
    }
  }
}
