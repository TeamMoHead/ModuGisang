import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { EmailService } from './email.service';
import { retry } from 'rxjs';

@Controller('/api/email')
export class EmailController {
    constructor(private readonly emailService: EmailService) { }

    @Get('check')
    // @HttpCode(200)
    async emailCheck(@Res() res: Response, @Query('email') email: string) {
        const random = await this.emailService.sendMail( email );
        res.status(HttpStatus.OK).send(random);
        //return random;
    }
}