import { NotificationType } from '@core/common/enum/NotificationType';
import { BaseRepository } from '@core/common/repository/BaseRepository';
import { notifcations } from '@infrastructure/orm/schema';
import { and, desc, eq } from 'drizzle-orm';
import { NotificationEntity } from './entity/Notification';

export class NotificationRepository extends BaseRepository {
  async create(
    user_id: number,
    title: string,
    content: string,
    type: NotificationType,
    redirect_url: string,
  ): Promise<NotificationEntity> {
    const result = await this.database.insert(notifcations).values({
      type,
      userId: user_id,
      redirectUrl: redirect_url,
      content,
      title,
    });

    return this.getById(result[0].insertId);
  }

  async getById(id: number): Promise<NotificationEntity> {
    return this.database.query.notifcations.findFirst({
      where: eq(notifcations.id, id),
      with: {
        user: true,
      },
    });
  }

  async getByUserId(
    user_id: number,
    is_read: boolean = false,
    is_get_all: boolean = false,
  ): Promise<NotificationEntity[]> {
    if (is_get_all) {
      return this.database.query.notifcations.findMany({
        where: eq(notifcations.userId, user_id),
        with: {
          user: true,
        },
        orderBy: [desc(notifcations.createdAt)],
      });
    }

    return this.database.query.notifcations.findMany({
      where: and(eq(notifcations.userId, user_id), eq(notifcations.isRead, is_read)),
      with: {
        user: true,
      },
    });
  }

  async changeStatus(id: number, is_read: boolean): Promise<void> {
    await this.database
      .update(notifcations)
      .set({
        isRead: is_read,
      })
      .where(eq(notifcations.id, id));
  }

  async changeStatusAllOfUser(user_id: number, is_read: boolean): Promise<void> {
    await this.database
      .update(notifcations)
      .set({
        isRead: is_read,
      })
      .where(eq(notifcations.userId, user_id));
  }

  async delete(id: number): Promise<void> {
    await this.database.delete(notifcations).where(eq(notifcations.id, id));
  }

  async deleteAllOfUser(user_id: number): Promise<void> {
    await this.database.delete(notifcations).where(eq(notifcations.userId, user_id));
  }
}
