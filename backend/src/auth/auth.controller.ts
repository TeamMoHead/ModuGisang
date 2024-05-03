import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
// import { Request, Response } from 'express';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { AuthenticateGuard } from './auth.guard';
import { Response } from 'express';
import { UserService } from 'src/users/users.service';
// import { UsersEntity } from 'src/users/users.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import RedisCacheService from 'src/redis-cache/redis-cache.service';

@Controller('api/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) { }

    @Post()
    async authNumCheck(@Res() res: Response, @Body() data: any) {
        console.log(data);
        const result = await this.authService.authNumcheck(data.email, data.authNum);
        console.log(result);
        if (result) {
            res.status(HttpStatus.OK).send('인증 성공');
        } else {
            res.status(HttpStatus.BAD_REQUEST).send('인증 실패');
        }

    }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    async login(/*@Res() res: Response,*/ @Body() user: UserDto) {
        const accessToken = await this.authService.validateUser(user);
        const refreshToken = await this.authService.generateRefreshToken(user);
        await this.userService.setCurrentRefreshToken(refreshToken, user.email);    //db에 저장
        const userId = await this.userService.findUser(user.email);
        // res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 900000, secure: true });
        // res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 900000, secure: true });
        // res.send({
        //     accessToken: accessToken,
        //     refreshToken: refreshToken
        // });
        console.log("로그인 성공");
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: userId._id
        }
    }

    @Get('authenticate')
    @UseGuards(AuthenticateGuard)
    isAuthenticated(@Request() req): any {
        console.log("인증 성공");
        if (req.user) {
            // console.log(req.user);

            return 'AUTH TOKEN';
        } else {
            return 'FAIL TOKEN';
        }
    }

    @Post('refresh')
    async refresh(
        @Body() refreshTokenDto: RefreshTokenDto
    ) {
        try {
            const newAccessToken = (await this.authService.refresh(refreshTokenDto));

            return {
                accessToken: newAccessToken,
            }
        } catch (err) {
            throw new UnauthorizedException('Invalid refresh-token');
        }
    }

    @Post('logout')
    @UseGuards(JwtRefreshGuard)
    async logout(@Req() req) {
        await this.userService.removeRefreshToken(req.user.id);

        return "Logout Done";
    }
}




