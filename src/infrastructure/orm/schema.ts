import { ImageType } from '@core/common/enum/ImageType';
import { InteractionType } from '@core/common/enum/InteractionType';
import { LockUserType } from '@core/common/enum/LockUserType';
import { UserRole } from '@core/common/enum/UserRole';
import { relations } from 'drizzle-orm';
import {
  boolean,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { GenerationStatus } from '@core/common/enum/GenerationStatus';
import { NotificationType } from '@core/common/enum/NotificationType';

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
  avatar: text('avatar'),
  background: text('background'),
});

export const users_relations = relations(users, ({ many, one }) => ({
  images: many(images),
  albums: many(albums),
  images_interaction: many(images_interaction),
  locked_user: one(locked_users),
}));

export const locked_users = mysqlTable('locked_users', {
  userId: int('user_id')
    .primaryKey()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  lockedAt: timestamp('locked_at').defaultNow(),
  type: mysqlEnum('type', [LockUserType.TEMPARORY, LockUserType.PERMANENT]).default(
    LockUserType.TEMPARORY,
  ),
  expiredAt: timestamp('expired_at').default(null),
});

export const users_lock_relation = relations(users, ({ one, many }) => ({
  user: one(users),
  generations: many(generations),
  notifactions: many(notifcations),
}));

export const images = mysqlTable('images', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  type: mysqlEnum('role', [
    ImageType.UPLOADED,
    ImageType.IMG_TO_IMG,
    ImageType.TEXT_TO_IMG,
    ImageType.IMG_BY_IMAGES_STYLE,
  ]),
  prompt: text('prompt'),
  aiName: text('ai_name'),
  style: text('model_name'),
  additionInfo: text('addition_info'),
  visibility: boolean('visibility').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  storageId: text('storage_id'),
  generateId: text('generate_id'),
  removeBackground: text('remove_background_url'),
  upscale: text('upscale_url'),
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

export const generations = mysqlTable('generations', {
  id: varchar('id', { length: 128 }).notNull().primaryKey(),
  status: mysqlEnum('status', [
    GenerationStatus.WAITING,
    GenerationStatus.PROCESSING,
    GenerationStatus.FINISHED,
    GenerationStatus.CANCELED,
  ]),
  userId: int('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  isSentMail: boolean('is_sent_mail').default(false),
  isNotification: boolean('is_notification').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const generations_relations = relations(generations, ({ one }) => ({
  user: one(users, { fields: [generations.userId], references: [users.id] }),
}));

export const notifcations = mysqlTable('notifications', {
  id: int('id').primaryKey().autoincrement(),
  title: text('title').notNull(),
  type: mysqlEnum('type', [NotificationType.GENERATION, NotificationType.OTHER]).default(
    NotificationType.OTHER,
  ),
  userId: int('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  isRead: boolean('is_read').default(false),
  redirectUrl: text('redirect_url'),
  content: text('content'),
  referenceData: text('reference_data').default(null),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifcations_relations = relations(notifcations, ({ one }) => ({
  user: one(users, { fields: [notifcations.userId], references: [users.id] }),
}));
