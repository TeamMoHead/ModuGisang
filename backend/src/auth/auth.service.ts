import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { UserDto } from './dto/user.dto';
import * as argon2 from 'argon2';
import { Payload } from './payload.interface';
// import { refreshJwtConstants } from './constants';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    // accessToken 생성
    async validateUser(userDto: UserDto): Promise<string> {
        const userFind = await this.userService.findUser(userDto.email);
        const validatePassword = await argon2.verify(userFind.password, userDto.password);
        if (!userFind || !validatePassword) {
            throw new UnauthorizedException();
        }
        const payload = { sub: userFind._id, _id: userFind._id, username: userFind.userName };
        return this.jwtService.signAsync(payload);
    }
    // 토큰 Payload에 해당하는 아아디의 유저 가져오기
    async tokenValidateUser(payload: Payload): Promise<UserDto | undefined> {
        const user = await this.userService.findOneByID(payload.id);
        if (!user) {
            console.log("No user found with ID:", payload.id);
            throw new UnauthorizedException('User does not exist');
        }
        return user;
    }

    // refreshToken 생성
    async generateRefreshToken(userDto: UserDto): Promise<string> {
        const user = this.userService.findUser(userDto.email);
        return this.jwtService.signAsync({ id: (await user)._id }, {
            secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
            expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXP')
        });
    }

    async refresh(refreshTokenDto: RefreshTokenDto): Promise<string> {
        const refreshToken  = refreshTokenDto.refreshToken;
        try {
            const decodedRefreshToken = this.jwtService.verify(refreshToken, { secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'), });
            const userId = decodedRefreshToken.id;
            const user = await this.userService.getUserIfRefreshTokenMatches(refreshToken, userId);
            if (!user) {
                throw new UnauthorizedException('Invalid user!');
            }

            const accessToekn = await this.generateAccessToken(user); // userdto로 변환

            return accessToekn;
        } catch (err) {
            throw new UnauthorizedException(err);
        }
    }

    async generateAccessToken(userDto: UserDto): Promise<string> {
        const userFind = await this.userService.findUser(userDto.email);
        if (!userFind || userFind.password != userDto.password) {
            throw new UnauthorizedException();
        }
        const payload = { sub: userFind._id, id: userFind._id, username: userFind.userName };
        return this.jwtService.signAsync(payload);

    }
}