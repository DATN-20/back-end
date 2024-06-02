export interface IRateLimiterStorage {
  setDefaultBucket(
    user: RateLimiterUser,
    bucket_size: number,
    refill_rate: number,
    endpoint: string,
  ): Promise<void>;
  decrement(user: RateLimiterUser, endpoint: string): Promise<number>;
  increment(user: RateLimiterUser, endpoint: string): Promise<number>;
  getExpiredAt(user: RateLimiterUser, endpoint: string): Promise<Date>;
}
