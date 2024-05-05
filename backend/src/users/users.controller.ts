import { Body, Controller, Request, Post, UseGuards, Res, Param, BadRequestException } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/auth/dto/user.dto';

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