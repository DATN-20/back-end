import { images } from '@infrastructure/orm/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Image = InferSelectModel<typeof images>;
export type NewImage = InferInsertModel<typeof images>;
