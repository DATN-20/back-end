import { images_album } from '@infrastructure/orm/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type ImageAlbum = InferSelectModel<typeof images_album>;
export type NewImageAlbum = InferInsertModel<typeof images_album>;
