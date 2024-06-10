export interface ITransaction<T> {
  startTransaction(): Promise<T>;
  commitTransaction(): Promise<T>;
  rollBackTransaction(): Promise<T>;
  releaseTransaction(): Promise<T>;
}
