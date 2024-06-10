import { DrizzleModule } from '@infrastructure/orm/DrizzleModule';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { RedisModule } from '@infrastructure/redis/RedisModule';
import { MessageQueueModule } from '@infrastructure/message-queue/MessageQueueModule';
import { BaseRepository } from '@core/common/repository/BaseRepository';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
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
  ],
  controllers: [],
  providers: [JwtUtil, BaseRepository],
  exports: [JwtUtil, BaseRepository],
})
export class InfrastructureModule {}
