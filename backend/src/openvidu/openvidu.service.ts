import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OpenVidu } from 'openvidu-node-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenviduService {
    private openvidu: OpenVidu;
    private OPENVIDU_URL = this.configService.get<string>('OPENVIDU_URL');
    private OPENVIDU_SECRET = this.configService.get<string>('OPENVIDU_SECRET');

    constructor(
        private configService:ConfigService
    ){
        this.openvidu = new OpenVidu(this.OPENVIDU_URL, this.OPENVIDU_SECRET);
    }

    async createSessions(body:any){
        try {
            const session = this.openvidu.activeSessions.find((s) => s.sessionId === body.customSessionId);
            if(session !== undefined){
                return body.customSessionId;
            }else{
                return await this.openvidu.createSession(body);
            }
            // const session = await this.openvidu.createSession(body);
            // return session.sessionId;
        } catch (error) {
            console.log(error);
        }
    }

    async createConnection(sessionId:string, body:any){
        const session = this.openvidu.activeSessions.find(
            (s) => s.sessionId === sessionId,
        );

        this.listActiveSessions();
        if(!session){
            throw new HttpException('Session not found',HttpStatus.NOT_FOUND);
        }else{
            try{
                const connection = await session.createConnection(body);
                return connection.token;
            }catch(error){
                throw new HttpException(
                    'Error creating connection: ' + error.message,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                  );
          
            }
        }
    }

    async listActiveSessions() {
        try {
            this.openvidu.activeSessions.find((s) => console.log("sessionlist : "+s.sessionId));
        } catch (error) {
            console.error('Error fetching active sessions:', error);
        }
      }
}
