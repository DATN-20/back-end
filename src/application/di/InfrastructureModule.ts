import { DrizzleModule } from '@infrastructure/orm/DrizzleModule';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { EventEmitterService } from '@infrastructure/event-emitter/EventEmitterService';

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
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [JwtUtil, EventEmitterService],
  exports: [JwtUtil, EventEmitterService],
})
export class InfrastructureModule {}
