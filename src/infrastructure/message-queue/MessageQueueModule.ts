import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
          // only handle 10 request generations/minute
          // jobs get rate limited, that remain stay in queue
          limiter: {
            max: 10,
            duration: 60,
            bounceBack: true,
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
  exports: [BullModule],
})
export class MessageQueueModule {}
