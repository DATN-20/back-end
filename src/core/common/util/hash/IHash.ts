export interface IHash {
  hash(data: string): Promise<string>;
  compare(target_data: string, hashed_data: string): Promise<boolean>;
}
