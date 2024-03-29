import { ImageType } from '@core/common/enum/ImageType';
import { InteractionType } from '@core/common/enum/InteractionType';
import { UserRole } from '@core/common/enum/UserRole';
import { VisibilityType } from '@core/common/enum/VisibilityType';
import { relations } from 'drizzle-orm';
import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

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
  socials: json('socials').$type<Social[]>(),
  role: mysqlEnum('role', [UserRole.ADMIN, UserRole.ARTIST, UserRole.GUEST]),
  refeshToken: varchar('refresh_token', { length: 256 }),
  accessToken: varchar('access_token', { length: 256 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const users_relations = relations(users, ({ many }) => ({
  images: many(images),
  albums: many(albums),
  images_interaction: many(images_interaction),
}));

export const images = mysqlTable('images', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  type: mysqlEnum('role', [ImageType.UPLOADED, ImageType.IMG_TO_IMG, ImageType.TEXT_TO_IMG]),
  prompt: text('prompt'),
  aiName: text('ai_name'),
  style: text('model_name'),
  additionInfo: text('addition_info'),
  visibility: mysqlEnum('visibility', [
    VisibilityType.PUBLIC,
    VisibilityType.PRIVATE,
    VisibilityType.HIDDEN,
  ]),
  createdAt: timestamp('created_at').defaultNow(),
  storageId: text('storage_id'),
});

export const albums = mysqlTable('albums', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const albums_relation = relations(albums, ({ many }) => ({
  images: many(images),
}));

export const albums_user_relation = relations(albums, ({ one }) => ({
  user: one(users, {
    fields: [albums.userId],
    references: [users.id],
  }),
}));

export const images_album = mysqlTable('images_album', {
  albumId: int('album_id')
    .notNull()
    .references(() => albums.id, { onDelete: 'cascade' }),
  imageId: int('image_id')
    .notNull()
    .references(() => images.id, { onDelete: 'cascade' }),
  addedAt: timestamp('added_at').defaultNow(),
});

export const image_relations = relations(images, ({ many }) => ({
  images_interaction: many(images_interaction),
}));

export const images_interaction = mysqlTable('images_interaction', {
  userId: int('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  imageId: int('image_id')
    .notNull()
    .references(() => images.id, { onDelete: 'cascade' }),
  type: mysqlEnum('type', [InteractionType.LIKE]),
  updatedAt: timestamp('created_at').defaultNow(),
});

export const images_interaction_relations = relations(images_interaction, ({ one }) => ({
  images: one(images),
  users: one(users),
}));
