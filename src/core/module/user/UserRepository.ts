import { BaseRepository } from '@core/common/repository/BaseRepository';
import { User } from './entity/User';
import { users } from '@infrastructure/orm/schema';

export class UserRepository extends BaseRepository {
  async createUser(user: User) {
    // const result = await this.db.transaction(async (tx) => {
    //   const result = await tx.insert(users).values(user);
    //   if (!result) {
    //     tx.rollback();
    //     return;
    //   }
    //   return result[0];
    // });
    // return result.insertId;
  }
}
