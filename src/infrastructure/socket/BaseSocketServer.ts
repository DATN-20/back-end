import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

export class BaseSocketServer {
  @WebSocketServer() protected server: Server;
}
