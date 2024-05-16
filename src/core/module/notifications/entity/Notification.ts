import { notifcations } from '@infrastructure/orm/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type NotificationEntity = InferSelectModel<typeof notifcations>;
export type NewNotification = InferInsertModel<typeof notifcations>;
