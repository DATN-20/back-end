import { ai_models } from '@infrastructure/orm/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type AiModel = InferSelectModel<typeof ai_models>;
export type NewAiModel = InferInsertModel<typeof ai_models>;
