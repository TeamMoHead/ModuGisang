import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { OpenviduService } from './openvidu.service';

@Controller('api')
export class OpenviduController {
    constructor(private readonly openviduService:OpenviduService){}

    @Get()
    connected() {
        return {data: "Connected!"};
    }

    @Post('sessions')
    async createSession(@Body() body:any){
        console.log(body);
        console.log("controller create sessions");
        return this.openviduService.createSessions(body);
    }
    
    @Post('sessions/:challengeId/connections')
    async createConnection(
        @Param('challengeId') challengeId: string,
        @Body() body:any
    ){
        console.log("controller create connections");
        console.log(body);
        return this.openviduService.createConnection(challengeId,body);
    }

}
