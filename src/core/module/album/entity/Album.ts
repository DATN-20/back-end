import { albums } from '@infrastructure/orm/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Album = InferSelectModel<typeof albums>;
export type NewAlbum = InferInsertModel<typeof albums>;
