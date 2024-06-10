import { NotificationEntity } from '@core/module/notifications/entity/Notification';
import { BaseSocketServer } from './BaseSocketServer';
import { NOTIFICATION_CHANNEL } from './ChannelConstant';
import { NotifcationResponse } from '@core/module/notifications/entity/response/NotificationResponse';

export class NotificationGateway extends BaseSocketServer {
  async handleSendNotification(notification: NotificationEntity): Promise<void> {
    const socket_id = await this.redis.get(`sockets:${notification.userId}`);

    if (!socket_id) {
      return;
    }

    this.server
      .to(socket_id)
      .emit(NOTIFICATION_CHANNEL, NotifcationResponse.convertFromEntity(notification).toJson());
  }
}
