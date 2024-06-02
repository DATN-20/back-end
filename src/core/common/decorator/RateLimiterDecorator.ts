import { applyDecorators, SetMetadata, UseFilters, UseGuards } from '@nestjs/common';
import { RateLimiterGuard } from '../guard/RateLimiterGuard';
import { ExceptionFilterRateLimiter } from '../exception-filter/ExceptionFilterRateLimiter';

export const RATE_LIMITER_PROPS = 'RATE_LIMITER_PROPS';

export interface RateLimiterProps {
  maxTokens: number;
  refillRate: number;
}

export const ApplyRateLimiter = (data: RateLimiterProps) => {
  return applyDecorators(
    SetMetadata(RATE_LIMITER_PROPS, data),
    UseGuards(RateLimiterGuard),
    UseFilters(ExceptionFilterRateLimiter),
  );
};
