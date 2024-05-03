import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { UserService } from "src/users/users.service";
import { Payload } from "./payload.interface";
import { UserDto } from "./dto/user.dto";
import { UsersEntity } from "src/users/users.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        private userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 토큰 분석
            ignoreExpiration: true,
            secretOrKey: process.env.REFRESH_TOKEN_SECRET_KEY,  // 생성자에서 바로 접근
        });
    }

    async validate(req: UsersEntity, done: VerifiedCallback): Promise<any> {
        console.log("secretOrKey .env: ", process.env.REFRESH_TOKEN_SECRET_KEY);
        const user = await this.userService.getUserRefreshToken(req._id);
        return user;
    }
}
