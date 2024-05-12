import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { EmailService } from './email.service';

@Controller('/api/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Get('check')
  async emailCheck(@Res() res: Response, @Query('email') email: string) {
    const result = await this.emailService.checkAndSendEmail(email);
    if (result.success) {
      res.status(HttpStatus.OK).send(result.message);
    } else {
      res.status(HttpStatus.BAD_REQUEST).send(result.message);
    }
  }
}
