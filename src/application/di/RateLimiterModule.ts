import { RedisRateLimiterStorage } from '@core/common/rate-limter/RedisRateLimiterStorage';
import { RedisModule } from '@infrastructure/redis/RedisModule';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [RedisModule],
  providers: [RedisRateLimiterStorage],
  exports: [RedisRateLimiterStorage],
})
export class RateLimiterModule {}
