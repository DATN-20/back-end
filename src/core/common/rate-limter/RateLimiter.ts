import { Exception } from '../exception/Exception';
import { ErrorBaseSystem } from '../resource/error/ErrorBase';
import { IRateLimiterStorage } from './IRateLimiterStorage';

export class RateLimiter {
  private storage: IRateLimiterStorage;
  private bucketSize: number; // the maximum number of tokens allowed in the bucket
  private refillRate: number; // number of tokens put into the bucket every seconds
  private user: RateLimiterUser;
  private endpoint: string;

  constructor(
    storage: IRateLimiterStorage,
    bucket_size: number,
    refill_rate: number,
    user: RateLimiterUser,
    endpoint: string,
  ) {
    this.storage = storage;
    this.bucketSize = bucket_size;
    this.refillRate = refill_rate;
    this.user = user;
    this.endpoint = endpoint;
  }

  private async init(): Promise<void> {
    await this.storage.setDefaultBucket(this.user, this.bucketSize, this.refillRate, this.endpoint);
  }

  async execute(): Promise<Exception | void> {
    await this.init();
    const remain_size = await this.storage.decrement(this.user, this.endpoint);
    if (remain_size < 0) {
      const expired_at = await this.storage.getExpiredAt(this.user, this.endpoint);
      return new Exception(
        ErrorBaseSystem.TOO_MANY_REQUEST_TO_ENDPOINT(this.bucketSize, expired_at),
      );
    }
  }
}
