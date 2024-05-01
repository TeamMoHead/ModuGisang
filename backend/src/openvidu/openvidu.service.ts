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
            const session = await this.openvidu.createSession(body);
            return session.sessionId;
        } catch (error) {
            console.log(error);
        }
    }

    async createConnection(sessionId:string, body:any){
        console.log(body);
        const session = this.openvidu.activeSessions.find(
            (s) => s.sessionId === sessionId,
        );
        console.log("세션");
        console.log(session);
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
}
