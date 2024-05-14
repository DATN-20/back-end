import { generations } from '@infrastructure/orm/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Generation = InferSelectModel<typeof generations>;
export type NewGeneration = InferInsertModel<typeof generations>;
