import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { EmailService } from './email.service';
import { retry } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/users/users.service';
import RedisCacheService from 'src/redis-cache/redis-cache.service';

@Controller('/api/email')
export class EmailController {
    constructor(
        private readonly emailService: EmailService,
        private userService: UserService,
        private redisService: RedisCacheService
    ) { }

    @Get('check')
    // @HttpCode(200)
    async emailCheck(@Res() res: Response, @Query('email') email: string) {
        const emailcheck = await this.userService.findUser(email);
        if (emailcheck) {
            res.status(HttpStatus.BAD_REQUEST).send("이미 존재하는 이메일입니다.");
            return;
        }
        else {
            const random = await this.emailService.sendMail(email);
            this.redisService.set(email, random, 180); // 캐시 유지 시간 3분
            res.status(HttpStatus.OK).send("인증번호 전송완료")/*.send(random);*/
        }
        //return random;
    }
}