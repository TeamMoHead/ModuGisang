import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { AuthenticateGuard } from './auth.guard';
import { Response } from 'express';
import { UserService } from 'src/users/users.service';
// import { UsersEntity } from 'src/users/users.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('api/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private jwtService:JwtService
    ) { }

    @Post("login")
    async login(@Body() user: UserDto) {
        try {
            const accessToken = await this.authService.validateUser(user);
            const refreshToken = await this.authService.generateRefreshToken(user);
            await this.userService.setCurrentRefreshToken(refreshToken, user.email);    //db에 저장
            const userId = await this.userService.findUser(user.email);
            if (accessToken && refreshToken){
                console.log("로그인 성공");
                return {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    userId: userId._id 
                }
            
            }else{
                throw new UnauthorizedException("로그인 실패");
            }
            // res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 900000, secure: true });
            // res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 900000, secure: true });
            // res.send({
            //     accessToken: accessToken,
            //     refreshToken: refreshToken
            // });
        } catch (error) {
            throw new HttpException({
                status: "error",
                message: "로그인 실패, 서버 에러"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Get('authenticate')
    @UseGuards(AuthenticateGuard)
    async isAuthenticated(@Request() req) {
        console.log(req.user);
        if (req.user) {
            console.log("인증 성공");
            return {
                status:"sucess",
                message: "Access Token 인증 성공"
            }

        } else {
            throw new UnauthorizedException("Access Token 인증 실패");
        }
    }

    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    async refresh(
        @Body() refreshTokenDto: RefreshTokenDto,
    ) {
        try {
            const newAccessToken = await this.authService.refresh(refreshTokenDto);
            console.log(newAccessToken);
            if(newAccessToken){
                console.log("AccessToken 재성성 성공")
                return {
                    status:"success",
                    message:"AccessToken 생성 성공", 
                    data:{
                        accessToken: newAccessToken,
                    }
                }
            }else{
                throw new UnauthorizedException('Access Token create fail');
            }
        } catch (err) {
            throw new UnauthorizedException('Invalid refresh-token');
        }
    }

    @Get('logout')
    @UseGuards(AuthenticateGuard)
    async logout(@Req() req) {
        const token = await this.userService.removeRefreshToken(req.user._id);
        console.log(token.affected);
        if(token.affected > 0){
            return {
                status:"success",
                message:"로그아웃 성공",
            }
        }else{
            throw new UnauthorizedException('Login Fail');
        }
    }
}