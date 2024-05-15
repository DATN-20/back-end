import { NotificationType } from '@core/common/enum/NotificationType';
import { User } from '@core/module/user/entity/User';
import { NotificationEntity } from '../Notification';
import { UserProfileResponse } from '@core/module/user/entity/response/UserProfileResponse';
import { NotifcationResponseJson } from './NotificationResponseJson';

export class NotifcationResponse {
  private id: number;
  private title: string;
  private content: string;
  private type: NotificationType;
  private user: User;
  private isRead: boolean;
  private redirectUrl: string;
  private createdAt: Date;

  constructor(
    id: number,
    title: string,
    content: string,
    type: NotificationType,
    isRead: boolean,
    redirect_url: string,
    created_at: Date,
    user: User = null,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.type = type;
    this.isRead = isRead;
    this.redirectUrl = redirect_url;
    this.createdAt = created_at;
    this.user = user;
  }

  public static convertFromEntity(notification: NotificationEntity): NotifcationResponse {
    return new NotifcationResponse(
      notification.id,
      notification.title,
      notification.content,
      notification.type,
      notification.isRead,
      notification.redirectUrl,
      notification.createdAt,
      notification['user'] ?? null,
    );
  }

  toJson(): NotifcationResponseJson {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      type: this.type,
      user: this.user ? UserProfileResponse.convertFromEntity(this.user).toShortJson() : null,
      is_read: this.isRead,
      redirect_url: this.redirectUrl,
      created_at: this.createdAt,
    };
  }
}
