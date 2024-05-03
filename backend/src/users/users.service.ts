import { Injectable, UnauthorizedException, flatten } from '@nestjs/common';
import { UsersEntity } from './users.entity';
import * as argon2 from "argon2";
import { Repository } from 'typeorm';
import { UserDto } from 'src/auth/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
// import { refreshJwtConstants } from 'src/auth/constants';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UsersEntity)
        private userRepository: Repository<UsersEntity>,
        private configService: ConfigService
    ) {
        this.userRepository = userRepository;
    }

    async createUser(email: string, password: string, username: string): Promise<UsersEntity> {
        const newUser = new UsersEntity();
        newUser.userName = username;
        newUser.email = email;
        newUser.password = password;
        newUser.affirmation = "오늘 하루도 화이팅!";
        newUser.profile = "https://cdn-icons-png.flaticon.com/512/2919/2919906.png";
        newUser.medals = {
            gold: 0,
            silver: 0,
            bronze: 0,
        }
        return this.userRepository.save(newUser);
    }

    async findUser(email: string): Promise<UsersEntity> {
        const user = await this.userRepository.findOne({ where: { email } });
        return user;
    }

    async findOneByID(_id: number): Promise<any> {
        return await this.userRepository.findOne({ where: { _id } });
    }

    // refreshToken db에 저장
    async setCurrentRefreshToken(refreshToken: string, userEmail: string) {
        const currentRefreshToken = await this.getCurrentHashedRefreshToken(refreshToken);
        const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();
        const user = await this.userRepository.findOne({ where: { email: userEmail } });
        await this.userRepository.update(user._id, {
            currentRefreshToken: currentRefreshToken,
            currentRefreshTokenExp: currentRefreshTokenExp,
        })
    }

    async getCurrentHashedRefreshToken(refreshToken: string): Promise<string> {
        return argon2.hash(refreshToken);
    }

    async getCurrentRefreshTokenExp() {
        const currentDate = new Date();
        const currentRefreshTokenExp = new Date(currentDate.getTime() + parseInt(this.configService.get<string>('REFRESH_TOKEN_EXP')));
        return currentRefreshTokenExp;
    }

    async getUserRefreshToken(userId: number): Promise<UserDto> {
        const user = await this.userRepository.findOne({ where: { _id: userId } });
        if (!user) {
            return null;
        }

        return user;
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<UserDto> {
        const user = await this.userRepository.findOne({ where: { _id: userId } });

        if (!user.currentRefreshToken) {
            return null;
        }

        try {
            const isRefreshTokenMatching = await argon2.verify(
                user.currentRefreshToken,
                refreshToken
            );

            if (isRefreshTokenMatching) {
                const userDto = new UserDto();
                userDto.email = user.email;
                userDto.password = user.password;
                return userDto;
            }
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    async removeRefreshToken(userId: number): Promise<any> {
        return await this.userRepository.update(userId, {
            currentRefreshToken: null,
            currentRefreshTokenExp: null
        });
    }
}