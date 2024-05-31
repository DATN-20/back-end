import { BaseRepository } from '@core/common/repository/BaseRepository';
import { locked_users, users } from '@infrastructure/orm/schema';
import { User, UserWithLockedInformation } from './entity/User';
import { count, eq, sql } from 'drizzle-orm';
import { SocialRequest } from './entity/request/SocialRequest';
import { ProfileRequest } from './entity/request/ProfileRequest';
import { UserRole } from '@core/common/enum/UserRole';
import { QueryPagination } from '@core/common/type/Pagination';
import { Social } from '@core/common/type/Social';

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
    const user = await this.database.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
    user.socials ??= [];

    // when social only has one it not return array object, it only return object social
    // so this code will modify the returned data to array object in case user.socials is only one
    if (!user.socials.length) {
      user.socials = [
        {
          social_link: user.socials['social_link'],
          social_name: user.socials['social_name'],
        },
      ];
    }

    return user;
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

  async getAll(pagination?: QueryPagination): Promise<UserWithLockedInformation[]> {
    const query_sql = this.database
      .select({
        user: users,
        lockedInformation: locked_users,
      })
      .from(users)
      .leftJoin(locked_users, eq(users.id, locked_users.userId));

    if (pagination) {
      query_sql.limit(pagination.limit).offset((pagination.page - 1) * pagination.limit);
    }

    return query_sql;
  }

  async countNewUserInDate(date: Date): Promise<number> {
    const result = await this.database
      .select({ count: count() })
      .from(users)
      .where(
        sql`DAY(${users.createdAt}) = ${date.getDate()} and MONTH(${users.createdAt}) = ${
          date.getMonth() + 1
        } and YEAR(${users.createdAt}) = ${date.getFullYear()}`,
      );

    return result[0].count;
  }
}
