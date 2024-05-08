import { images_interaction } from '@infrastructure/orm/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type ImageInteraction = InferSelectModel<typeof images_interaction>;
export type NewImageInteraction = InferInsertModel<typeof images_interaction>;
