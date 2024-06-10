import { Module } from '@nestjs/common';
import { BaseSocketServer } from './BaseSocketServer';
import { NotificationGateway } from './NotificationGataway';
import { UserModule } from '@application/di/UserModule';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [BaseSocketServer, NotificationGateway],
  exports: [BaseSocketServer, NotificationGateway],
})
export class SocketModule {}
