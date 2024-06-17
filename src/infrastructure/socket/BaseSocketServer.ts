import { EnvironmentUtil } from '@core/common/util/EnvironmentUtil';
import { JwtType, JwtUtil, TokenPayload } from '@core/common/util/jwt/JwtUtil';
import { REDIS_CLIENT } from '@infrastructure/redis/RedisConstant';
import { Inject, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';

const SOCKET_PORT = 3001;

@WebSocketGateway(SOCKET_PORT, {
  cors: {
    origin: EnvironmentUtil.isDevMode()
      ? '*'
      : ['https://mangahay.top', 'https://api.mangahay.top'],
  },
})
export class BaseSocketServer implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  private logger: Logger;
  @WebSocketServer() protected server: Server;

  constructor(
    @Inject(REDIS_CLIENT) protected readonly redis: Redis,
    private readonly jwtUtil: JwtUtil,
  ) {
    this.logger = new Logger(BaseSocketServer.name);
  }

  afterInit(_server: Server): void {
    this.logger.log(`Socket server is listening in port ${SOCKET_PORT}`);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const user_id = client.handshake.query?.userId as string | null;

    if (!user_id) {
      return;
    }

    await this.redis.del(`sockets:${user_id}`);
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    let user_id = client.handshake.query?.userId as string | null;
    let token = client.handshake.query?.token as string | null;

    if (!token || !user_id) {
      client.disconnect();
      return;
    }

    token = token.toString();
    try {
      const payload: TokenPayload = this.jwtUtil.verify<TokenPayload>(token, JwtType.ACCESS);

      if (!payload || payload.id.toString() !== user_id) {
        throw new Error('Invalid token');
      }

      await this.redis.set(`sockets:${user_id}`, client.id);
    } catch (error) {
      client.disconnect();
    }
  }
}
