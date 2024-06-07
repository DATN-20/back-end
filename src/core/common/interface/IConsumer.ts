import { Job } from 'bull';

export interface IConsumer<T, Q> {
  process(job: Job<T>): Promise<Q>;
  onFailed(job: Job<T>, error: any): Promise<void>;
  onCompleted(job: Job<T>, result: Q): Promise<void>;
}
