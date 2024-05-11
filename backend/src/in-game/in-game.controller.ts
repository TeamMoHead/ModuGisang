import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { InGameService } from './in-game.service';
import { AuthenticateGuard } from 'src/auth/auth.guard';

@Controller('api/in-game')
export class InGameController {
  constructor(private readonly inGameService: InGameService) {}

  @Get('enter')
  @UseGuards(AuthenticateGuard)
  async recordEntryTime(@Req() req, @Res() res): Promise<any> {
    const userId = req.user._id; // 사용자 ID 추출 방법은 인증 방식에 따라 다를 수 있습니다.
    const result = await this.inGameService.recordEntryTime(userId);
    res.status(HttpStatus.OK).json({ suceess: result });
  }
}
