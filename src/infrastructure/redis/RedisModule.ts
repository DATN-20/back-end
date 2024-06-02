import { Module } from '@nestjs/common';
import { createClient } from 'redis';
import { REDIS_CLIENT } from './RedisConstant';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redis_url = configService.get<string>('REDIS_URL');
        const client = createClient({ url: redis_url });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
