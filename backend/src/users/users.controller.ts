import { Body, Controller, Request, Post, UseGuards, Res, Param, BadRequestException, Query, Get } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/user')
export class UserController {
    constructor(
        private readonly userService:UserService,
    ){}
    
    @Post("signup")
    async createUser(@Body() createUserDto:CreateUserDto){
        console.log("come here");
        console.log(createUserDto);
        const user = await this.userService.createUser(createUserDto.email,createUserDto.password,createUserDto.userName);
        return user;
    }

    @Get('/:userId')
    async searchUser(@Param('userId') userId:number){
        const user = await this.userService.findOneByID(userId);
        return {
            userName: user.userName,
            streakDays: 0, // 이 부분
            medals:{
                gold:user.medals.gold,
                silver:user.medals.silver,
                bronze:user.medals.bronze
            },
            invitationCounts:0, // streakDays와 invitationCounts 외래키를 통해 값 처리 후 반환 필요
            affirmation:user.affirmation,
            challengeId:user.challengeId
        }
    }

    @Post("/:userId/updateAffirm")
    async updateAffirm(@Param('userId') userId:number, @Body('affirmation') affirmation:string){
        if(affirmation === ''){
            throw new BadRequestException('격언 값이 없습니다.');
        }
        const user = await this.userService.findOneByID(userId);
        const result = await this.userService.updateAffirm(user,affirmation);
        if(result.affected > 0){
            return 'success';
        }else{
            throw new BadRequestException('격언 업로드 실패!');
        }
    }
}