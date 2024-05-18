import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import RedisCacheService from 'src/redis-cache/redis-cache.service';

interface ClientData {
  status: boolean;
  userId: string;
  joinTime: number;
  // clientSocketId: string;
}

interface Room {
  clients: { [key: string]: ClientData };
  missions: string[];
  currentMissionIndex: number;
  disconnectTimers: { [key: string]: NodeJS.Timeout };
}

@WebSocketGateway(+process.env.SOCKET_PORT, {
  transports: ['websocket'],
  cors: {
    origin: '*', // 모든 출처 허용. 필요한 경우 특정 출처로 제한 가능
  },
})
export class GameStatusGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private rooms: { [key: string]: Room } = {}; // 모든 방 정보를 저장하는 객체

  constructor(private redisClient: RedisCacheService) {} // RedisCacheService 추가

  handleConnection(client: Socket) {
    // Client connection 확인 핸들러
    // Client가 연결되었을 때 호출, Client ID를 로그에 출력
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    // Client disconnection 확인 핸들러\
    // Client가 연결이 끊겼을 때 호출, Client ID를 로그에 출력
    console.log('Client disconnected:', client.id);
    for (const roomId in this.rooms) {
      const room = this.rooms[roomId];
      if (room && room.clients[client.id]) {
        room.disconnectTimers[client.id] = setTimeout(() => {
          delete room.clients[client.id];
          delete room.disconnectTimers[client.id];
          this.checkAllLoaded(roomId);
        }, 30000);
        // 연결 해제시 각 방에서 해당 클라이언트를 제거하고 30초 후에 삭제 ?
      }
    }
  }

  @SubscribeMessage('JOIN_ROOM')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { challengeId: string; userId: string },
  ) {
    if (!client) {
      console.error('Client is undefined');
      return;
    }

    console.log('joinRoom data:', data);
    console.log('Client ID:', client.id); // 이 로그가 제대로 출력되는지 확인합니다

    if (!this.rooms[data.challengeId]) {
      // challengeId에 해당하는 방이 없는 경우
      this.rooms[data.challengeId] = {
        // 새로운 방 생성
        clients: {},
        missions: [
          'Waiting Room',
          'Mission 1',
          'Mission 2',
          'Mission 3',
          'Mission 4',
          'Mission 5',
          'Mission 6',
        ],
        currentMissionIndex: 0,
        disconnectTimers: {},
      };
    }
    client.join(data.challengeId); //

    // 클라이언트가 이미 방에 존재하지 않는 경우에만 추가
    if (!this.rooms[data.challengeId].clients[data.userId]) {
      const joinTime = Date.now();
      this.rooms[data.challengeId].clients[data.userId] = {
        status: false,
        userId: data.userId,
        joinTime,
        // clientSocketId: client.id,
      };
      console.log(`Client ${data.userId} joined room ${data.challengeId}`);
    }

    const currentMission =
      this.rooms[data.challengeId].missions[
        this.rooms[data.challengeId].currentMissionIndex
      ];
    client.emit('MISSION_STATE', { mission: currentMission });
  }

  @SubscribeMessage('SET_LOADING_STATUS')
  handleSetLoadingStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { challengeId: string; status: boolean; userId: string },
  ) {
    console.log('SetLoadingStatus client:', client.id); // 변경된 로그
    console.log('SetLoadingStatus data:', data);

    if (this.rooms[data.challengeId]) {
      this.rooms[data.challengeId].clients[data.userId].status = data.status;
      this.checkAllLoaded(data.challengeId);
    }
  }

  @SubscribeMessage('RECONNECT')
  handleReconnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { challengeId: string; userId: string },
  ) {
    console.log('Client reconnecting:', client.id); // 추가된 로그
    client.join(data.challengeId);
    const room = this.rooms[data.challengeId];
    if (room) {
      for (const clientId in room.clients) {
        if (room.clients[clientId].userId === data.userId) {
          clearTimeout(room.disconnectTimers[clientId]);
          delete room.disconnectTimers[clientId];
          room.clients[client.id] = room.clients[clientId];
          delete room.clients[clientId];
          break;
        }
      }
      const currentMission = room.missions[room.currentMissionIndex];
      client.emit('MISSION_STATE', { mission: currentMission });
    }
  }

  private checkAllLoaded(challengeId: string) {
    const room = this.rooms[challengeId];
    console.log('Checking all loaded:', room.clients);
    const statuses = Object.values(room.clients).map((client) => client.status);
    const allLoaded =
      statuses.length > 0 && statuses.every((status) => status === true);
    if (allLoaded) {
      this.server.to(challengeId).emit('ALL_LOADED');
    } else {
      this.server
        .to(challengeId)
        .emit('ROOM_STATUS', Object.values(room.clients));
    }
  }

  @SubscribeMessage('START_MISSION')
  handleStartMission(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { challengeId: string },
  ) {
    if (this.rooms[data.challengeId]) {
      const room = this.rooms[data.challengeId];
      if (room.currentMissionIndex < room.missions.length) {
        const currentMission = room.missions[room.currentMissionIndex];
        console.log('Starting mission:', currentMission);
        this.server
          .to(data.challengeId)
          .emit('MISSION_STATE', { mission: currentMission });
      }
    }
  }

  @SubscribeMessage('COMPLETE_MISSION')
  async handleCompleteMission(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { challengeId: string; score: number },
  ) {
    if (this.rooms[data.challengeId]) {
      const room = this.rooms[data.challengeId];
      const clientData = room.clients[client.id];
      const key = `room:${data.challengeId}:scores`;

      const weightedScore = data.score + clientData.joinTime / 1e12;
      await this.redisClient.zincrby(key, weightedScore, clientData.userId);

      this.server.to(data.challengeId).emit('UPDATE_SCORES', {
        userId: clientData.userId,
        score: weightedScore,
      });

      if (room.currentMissionIndex < room.missions.length) {
        room.currentMissionIndex++;
        if (room.currentMissionIndex < room.missions.length) {
          const nextMission = room.missions[room.currentMissionIndex];
          this.server
            .to(data.challengeId)
            .emit('MISSION_STATE', { mission: nextMission });
        } else {
          this.server.to(data.challengeId).emit('MISSION_COMPLETE');
        }
      }
    }
  }

  @SubscribeMessage('GET_RANKINGS')
  async handleGetRankings(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { challengeId: string },
  ) {
    const key = `room:${data.challengeId}:scores`;
    const rankings = await this.redisClient.zrevrange(key, 0, -1);
    client.emit('RANKINGS', rankings);
  }
}
