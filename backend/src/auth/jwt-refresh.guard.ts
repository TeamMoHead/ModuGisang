import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.body.refresh_token;
    const authorizationHeader = request.headers.authorization;
    const token = authorizationHeader?.split(' ')[1];
    if (token === 'null') {
      return true;
    } else {
      return super.canActivate(context);
    }
  }
}
