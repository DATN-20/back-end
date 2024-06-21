import { DrizzleModule } from '@infrastructure/orm/DrizzleModule';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { RedisModule } from '@infrastructure/redis/RedisModule';
import { MessageQueueModule } from '@infrastructure/message-queue/MessageQueueModule';
import { BaseRepository } from '@core/common/repository/BaseRepository';
import { SocketModule } from '@infrastructure/socket/SocketModule';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    JwtModule.register({
      global: true,
      secret: 'ABC',
      signOptions: {
        expiresIn: '1d',
      },
    }),
    RedisModule,
    MessageQueueModule,
    SocketModule,
  ],
  controllers: [],
  providers: [JwtUtil, BaseRepository],
  exports: [JwtUtil, BaseRepository, SocketModule, RedisModule],
})
export class InfrastructureModule {}
