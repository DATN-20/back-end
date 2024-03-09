import { User } from '@core/module/user/entity/User';
import { albums } from '@infrastructure/orm/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Album = InferSelectModel<typeof albums>;
export type NewAlbum = InferInsertModel<typeof albums>;
