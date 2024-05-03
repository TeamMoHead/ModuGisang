import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { EmailService } from './email.service';
import { retry } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/users/users.service';

@Controller('/api/email')
export class EmailController {
    constructor(
        private readonly emailService: EmailService,
        private authService: AuthService,
        private userService: UserService
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
            res.status(HttpStatus.OK).send(random);
        }
        //return random;
    }
}