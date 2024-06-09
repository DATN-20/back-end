import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisRateLimiterStorage } from '../rate-limter/RedisRateLimiterStorage';
import { RateLimiter } from '../rate-limter/RateLimiter';
import { UserFromAuthGuard } from '../type/UserFromAuthGuard';
import { RATE_LIMITER_PROPS, RateLimiterProps } from '../decorator/RateLimiterDecorator';
import { Exception } from '../exception/Exception';
import { EnvironmentUtil } from '../util/EnvironmentUtil';

const DEFAULT_RATE_LIMITER_PROPS: RateLimiterProps = {
  maxTokens: 5,
  refillRate: 1,
};

@Injectable()
export class RateLimiterGuard {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisRateLimiterStorage: RedisRateLimiterStorage,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (EnvironmentUtil.isDevMode()) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const endpoint = request.url;
    const ip_address = request.ip || request.connection.remoteAddress;

    const user = request.user as UserFromAuthGuard;
    const rate_limiter_props: RateLimiterProps =
      this.reflector.get(RATE_LIMITER_PROPS, context.getHandler()) ?? DEFAULT_RATE_LIMITER_PROPS;

    const rate_limiter = new RateLimiter(
      this.redisRateLimiterStorage,
      rate_limiter_props.maxTokens,
      rate_limiter_props.refillRate,
      {
        ipAddress: ip_address,
        userId: user?.id ?? null,
      },
      endpoint,
    );

    const result = await rate_limiter.execute();

    if (result instanceof Exception) {
      throw result;
    }

    return true;
  }
}
