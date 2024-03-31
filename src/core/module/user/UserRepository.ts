import { BaseRepository } from '@core/common/repository/BaseRepository';
import { users } from '@infrastructure/orm/schema';
import { User } from './entity/User';
import { SQL, eq, sql } from 'drizzle-orm';
import { SocialRequest } from './entity/request/SocialRequest';

export class UserRepository extends BaseRepository {
  async create(user: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    const result = await this.database.insert(users).values(user);

    return await this.getById(result[0].insertId);
  }

  async getById(id: number): Promise<User> {
    return this.database.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
  }

  async getByEmail(email: string): Promise<User> {
    return this.database.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  }

  async updateToken(
    id: number,
    access_token: string = null,
    refresh_token: string = null,
  ): Promise<User> {
    await this.database
      .update(users)
      .set({
        accessToken: access_token,
        refeshToken: refresh_token,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));

    return await this.getById(id);
  }

  async updatePassword(id: number, new_password: string): Promise<User> {
    await this.database
      .update(users)
      .set({
        password: new_password,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));

    return await this.getById(id);
  }

  async addSocial(id: number, social: SocialRequest): Promise<void> {
    await this.database
      .update(users)
      .set({
        socials: sql`CASE WHEN socials IS NULL THEN JSON_OBJECT( "social_name" , ${social.social_name},"social_link" , ${social.social_link}) ELSE JSON_ARRAY_APPEND (socials, '$', JSON_OBJECT( "social_name" , ${social.social_name},"social_link" , ${social.social_link})) END`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  //error here
  async deleteSocial(id: number, social_name: string): Promise<void> {
    await this.database
      .update(users)
      .set({
        socials: sql`JSON_REMOVE(socials, JSON_UNQUOTE(JSON_SEARCH(socials, 'one', ${social_name}, NULL, '$[*].social_link')))`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }
}
