import io from 'socket.io-client';

let socket;

self.onmessage = function (event) {
  const { action, payload } = event.data;

  switch (action) {
    case 'CONNECT':
      socket = io(payload.url, {
        transports: ['websocket'],
        cors: {
          origin: '*',
        },
      });

      socket.on('CONNECT', () => {
        self.postMessage({ type: 'STATUS', message: 'CONNECTED' });

        socket.emit('JOIN_ROOM', {
          challengeId: payload.challengeId,
          userId: payload.userId,
        });
      });

      socket.on('ALL_LOADED', data => {
        self.postMessage({ type: 'ALL_LOADED', data: true });
      });

      socket.on('MISSION_NUM', data => {
        self.postMessage({ type: 'MISSION_NUM', data: data.missionNum });
      });

      socket.on('GAME_END', data => {
        socket.emit('GET_RANKINGS', {
          challengeId: payload.challengeId,
        });
      });

      socket.on('RANKINGS', data => {
        self.postMessage({ type: 'RANKINGS', data });
      });

      socket.on('DISCONNECT', () => {
        self.postMessage({ type: 'STATUS', message: 'DISCONNECTED' });
      });

      socket.on('ERROR', error => {
        self.postMessage({ type: 'ERROR', message: error.message });
      });

      break;

    case 'SEND':
      if (socket) {
        socket.emit('MESSAGE', payload.message);
      }
      break;

    case 'REQUEST_GAME_STATE':
      if (socket) {
        socket.emit('REQUEST_GAME_STATE', { userId: payload.userId });
      }
      break;

    case 'DISCONNECT':
      if (socket) {
        socket.disconnect();
      }
      break;

    default:
      self.postMessage({ type: 'ERROR', message: 'Unknown action' });
  }
};
