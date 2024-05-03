import { Body, Controller, Request, Post, UseGuards, Res } from '@nestjs/common';
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
}