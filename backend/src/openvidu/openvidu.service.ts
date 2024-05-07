import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OpenVidu, OpenViduRole } from 'openvidu-node-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenviduService {
  private openvidu: OpenVidu;
  private OPENVIDU_URL = this.configService.get<string>('OPENVIDU_URL');
  private OPENVIDU_SECRET = this.configService.get<string>('OPENVIDU_SECRET');

  constructor(private configService: ConfigService) {
    this.openvidu = new OpenVidu(this.OPENVIDU_URL, this.OPENVIDU_SECRET);
  }

  async openviduTotalService(body: any) {
    try {
      const session = await this.findSession(body.userData.challengeId); // 동일한 세션이 있는지 검사
      return session
        ? await this.createToken(session.sessionId, body)
        : await this.handleNoSessionFound(body);
      // if(session !== undefined){ // 동일한 세션이 존재 O
      //     // const connection = await session.
      //     return await this.createToken(body.userData.challengeId, body);
      // }else{ // 동일한 세션이 존재 X
      //     const s = await this.openvidu.createSession({customSessionId: body.userData.challengeId});
      //     return await this.createToken(s.sessionId, body);
      //     // return connection.token;
      // }
    } catch (error) {
      console.log('Check existing session: ', error);
      return await this.handleNoSessionFound(body);
    }
  }

  async createToken(sessionId: string, body: any) {
    const session = await this.findSession(sessionId);

    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    } else {
      try {
        const tokenOptions = {
          data: `{"userId": "${body.userData.userId}", "userName": "${body.userData.userName}"}`,
          role: OpenViduRole.PUBLISHER,
        };
        const response = await session.generateToken(tokenOptions);
        console.log('Generated Token: ', response);
        if (response != null) {
          return response;
        } else {
          throw new HttpException(
            'Token generation failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      } catch (error) {
        console.error('Error creating connection: ', error);
        throw new HttpException(
          'Error creating connection: ' + error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async findSession(challengeId: string) {
    await this.listActiveSessions();
    return this.openvidu.activeSessions.find(
      (s) => s.sessionId === challengeId,
    );
  }

  async handleNoSessionFound(body: any) {
    try {
      console.log('No existing session found, creating new session');
      const session = await this.openvidu.createSession({
        customSessionId: body.userData.challengeId,
      });
      return this.createToken(session.sessionId, body);
    } catch (error) {
      console.error('Error creating new session : ', error);
      throw new HttpException(
        'Faild to create session ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async listActiveSessions() {
    try {
      this.openvidu.activeSessions.find((s) =>
        console.log('sessionlist : ' + s.sessionId),
      );
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    }
  }

  // 사용자의 세션 id에 대한 토큰을 발행 시 토큰 값만 전달할 수 있도록 반환
  // extractToken(url){
  //     const queryParmas = new URLSearchParams(new URL(url).search);
  //     const token = queryParmas.get('token');
  //     return token;
  // }
}
