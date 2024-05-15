import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './NotificationRepository';
import { NotifcationResponseJson } from './entity/response/NotificationResponseJson';
import { NotifcationResponse } from './entity/response/NotificationResponse';
import { GetNotificationsQuery } from './entity/request/GetNotificationsQuery';
import { Exception } from '@core/common/exception/Exception';
import { NotificationError } from '@core/common/resource/error/NotificationError';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async handleGetNotificationOfUser(
    user_id: number,
    query_data: GetNotificationsQuery,
  ): Promise<NotifcationResponseJson[]> {
    const notifications = await this.notificationRepository.getByUserId(
      user_id,
      query_data.isRead ?? false,
      !query_data.isRead,
    );
    return notifications.map(notifcation =>
      NotifcationResponse.convertFromEntity(notifcation).toJson(),
    );
  }

  async handleChangeStatusOfNotification(notification_id: number, user_id: number): Promise<void> {
    const matched_notification = await this.notificationRepository.getById(notification_id);

    if (!matched_notification) {
      throw new Exception(NotificationError.NOTIFICATION_NOT_FOUND);
    }

    if (matched_notification.userId !== user_id) {
      throw new Exception(NotificationError.FORBIDDEN_TO_TAKE_ACTION);
    }

    await this.notificationRepository.changeStatus(notification_id, !matched_notification.isRead);
  }
}
