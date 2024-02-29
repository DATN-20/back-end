import * as bcrypt from 'bcrypt';
import { IHash } from './IHash';
import { Injectable } from '@nestjs/common';
const SALT_ROUNDS = 10;

@Injectable()
export class BcryptHash implements IHash {
  async compare(target_data: string, hashed_data: string): Promise<boolean> {
    return await bcrypt.compare(target_data, hashed_data);
  }
  async hash(data: string): Promise<string> {
    const salt = await this.genSalt();
    return await bcrypt.hash(data, salt);
  }

  private async genSalt(): Promise<string> {
    return await bcrypt.genSalt(SALT_ROUNDS);
  }
}
