import { Inject, Injectable } from '@nestjs/common';
import { IRateLimiterStorage } from './IRateLimiterStorage';
import Redis from 'ioredis';
import { RATE_LIMITER_PREFIX } from '../constant/RateLimiterConstant';
import { REDIS_CLIENT } from '@infrastructure/redis/RedisConstant';

@Injectable()
export class RedisRateLimiterStorage implements IRateLimiterStorage {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async getExpiredAt(user: RateLimiterUser, endpoint: string): Promise<Date> {
    const expired_at = await this.redis.ttl(
      `${RATE_LIMITER_PREFIX}:${user.userId ?? user.ipAddress}:${endpoint}`,
    );
    const now = new Date();
    const expiration_date = new Date(now.getTime() + expired_at * 1000); // Convert seconds to milliseconds

    return expiration_date;
  }

  async setDefaultBucket(
    user: RateLimiterUser,
    bucket_size: number,
    refill_rate: number,
    endpoint: string,
  ): Promise<void> {
    const is_existed = !!(await this.redis.get(
      `${RATE_LIMITER_PREFIX}:${user.userId ?? user.ipAddress}:${endpoint}`,
    ));

    if (is_existed) {
      return;
    }

    await this.redis.set(
      `${RATE_LIMITER_PREFIX}:${user.userId ?? user.ipAddress}:${endpoint}`,
      bucket_size,
    );
    await this.redis.expire(
      `${RATE_LIMITER_PREFIX}:${user.userId ?? user.ipAddress}:${endpoint}`,
      refill_rate,
    );
  }

  async decrement(user: RateLimiterUser, endpoint: string): Promise<number> {
    return this.redis.decr(`${RATE_LIMITER_PREFIX}:${user.userId ?? user.ipAddress}:${endpoint}`);
  }

  async increment(user: RateLimiterUser, endpoint: string): Promise<number> {
    return this.redis.incr(`${RATE_LIMITER_PREFIX}:${user.userId ?? user.ipAddress}:${endpoint}`);
  }
}
