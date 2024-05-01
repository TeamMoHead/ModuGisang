import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OpenVidu,OpenViduRole } from 'openvidu-node-client';
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

    async openviduTotalService(body:any){
        try {
            console.log(body);
            const session = this.openvidu.activeSessions.find((s) => s.sessionId === body.userData.challengeId); // 동일한 세션이 있는지 검사
            if(session !== undefined){ // 동일한 세션이 존재 O
                // const connection = await session.
                return this.createConnection(session.sessionId, body);
            }else{ // 동일한 세션이 존재 X
                const s = await this.openvidu.createSession({customSessionId: body.userData.challengeId});
                return this.createConnection(s.sessionId, body);
                // return connection.token;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async createConnection(sessionId:string, body:any){
        const session = this.openvidu.activeSessions.find(
            (s) => s.sessionId === sessionId
        );
        
        if(!session){
            throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
        }else{
            try {
                const tokenOptions = {
                    data: `{"userId": "${body.userData.userId}", "userName": "${body.userData.userName}"}`,
                    role: OpenViduRole.PUBLISHER
                };
                const response = await session.generateToken(tokenOptions);
                const token = this.extractToken(response);
                return token;
                
            } catch (error) {
                throw new HttpException(
                    'Error creating connection : ' + error.message,
                    HttpStatus.INTERNAL_SERVER_ERROR 
                )
            }
        }
    }


    extractToken(url){
        const queryParmas = new URLSearchParams(new URL(url).search);
        const token = queryParmas.get('token');
        return token;
    }

    // async createSessions(body:any){
    //     try {
    //         const session = this.openvidu.activeSessions.find((s) => s.sessionId === body.customSessionId);
    //         if(session !== undefined){
    //             return body.customSessionId;
    //         }else{
    //             const sessionId = await this.openvidu.createSession(body);
    //             return sessionId.sessionId;
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // async createConnection(sessionId:string, body:any){
    //     const session = this.openvidu.activeSessions.find(
    //         (s) => s.sessionId === sessionId,
    //     );

    //     this.listActiveSessions();
    //     if(!session){
    //         throw new HttpException('Session not found',HttpStatus.NOT_FOUND);
    //     }else{
    //         try{
    //             const connection = await session.createConnection(body);
    //             return connection.token;
    //         }catch(error){
    //             throw new HttpException(
    //                 'Error creating connection: ' + error.message,
    //                 HttpStatus.INTERNAL_SERVER_ERROR,
    //               );
          
    //         }
    //     }
    // }

    async listActiveSessions() {
        try {
            this.openvidu.activeSessions.find((s) => console.log("sessionlist : "+s.sessionId));
        } catch (error) {
            console.error('Error fetching active sessions:', error);
        }
      }
}
