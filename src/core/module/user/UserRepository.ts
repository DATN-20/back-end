import { BaseRepository } from '@core/common/repository/BaseRepository';
import { users } from '@infrastructure/orm/schema';
import { User } from './entity/User';
import { SQL, eq, sql } from 'drizzle-orm';
import { SocialRequest } from './entity/request/SocialRequest';
import { ProfileRequest } from './entity/request/ProfileRequest';
import { UserRole } from '@core/common/enum/UserRole';

export class UserRepository extends BaseRepository {
  async create(user: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
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
        socials: sql`CASE WHEN socials IS NULL THEN JSON_OBJECT( "social_name" , ${social.socialName},"social_link" , ${social.socialLink}) ELSE JSON_ARRAY_APPEND (socials, '$', JSON_OBJECT( "social_name" , ${social.socialName}, "social_link" , ${social.socialLink})) END`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }
  async updateProfile(id: number, profile: ProfileRequest): Promise<void> {
    await this.database
      .update(users)
      .set({
        firstName: profile.firstName,
        lastName: profile.lastName,
        aliasName: profile.aliasName,
        phone: profile.phone,
        socials: sql`NULL`,
        address: profile.address,
        description: profile.description,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async updateAvatar(id: number, avatar: string): Promise<void> {
    await this.database
      .update(users)
      .set({
        avatar: avatar,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async updateBackground(id: number, background: string): Promise<void> {
    await this.database
      .update(users)
      .set({
        background: background,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }
}
