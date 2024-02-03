import { ImageType } from '@core/common/enum/ImageType';
import { UserRole } from '@core/common/enum/UserRole';
import {
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('username', { length: 256 }).notNull(),
  password: varchar('password', { length: 256 }).notNull(),
  firstName: varchar('first_name', { length: 256 }).notNull(),
  lastName: varchar('last_name', { length: 256 }).notNull(),
  aliasName: varchar('alias_name', { length: 256 }),
  phone: varchar('phone', { length: 256 }),
  address: varchar('address', { length: 256 }),
  description: varchar('description', { length: 256 }),
  socials: json('socials').$type<{
    socical_name: string | null;
    social_link: string | null;
  }>(),
  role: mysqlEnum('role', [UserRole.ADMIN, UserRole.ARTIST, UserRole.GUEST]),
  refeshToken: varchar('refresh_token', { length: 256 }),
  accessToken: varchar('access_token', { length: 256 }),
  createdAt: timestamp('timestamp').defaultNow(),
  updatedAt: timestamp('timestamp').defaultNow(),
});

export const images = mysqlTable('images', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  url: text('url').notNull(),
  type: mysqlEnum('role', [ImageType.UPLOADED, ImageType.GENERATED]),
  promp: text('promp'),
  additionInfo: text('addition_info'),
  createdAt: timestamp('timestamp').defaultNow(),
});

export const albums = mysqlTable('albums', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('timestamp').defaultNow(),
  updatedAt: timestamp('timestamp').defaultNow(),
});

export const images_album = mysqlTable('images_album', {
  albumId: int('album_id')
    .notNull()
    .references(() => albums.id),
  imageId: int('image_id')
    .notNull()
    .references(() => images.id),
  addedAt: timestamp('timestamp').defaultNow(),
});
