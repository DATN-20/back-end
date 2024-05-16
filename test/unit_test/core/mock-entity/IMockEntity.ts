export interface IMockEntity<T> {
  mock(): T;
  mockArray(length: number): Array<T>;
}
