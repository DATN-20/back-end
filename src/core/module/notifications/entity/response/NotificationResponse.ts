import { NotificationType } from '@core/common/enum/NotificationType';
import { User } from '@core/module/user/entity/User';
import { NotificationEntity } from '../Notification';
import { UserProfileResponse } from '@core/module/user/entity/response/UserProfileResponse';
import { NotifcationResponseJson } from './NotificationResponseJson';
import { IResponse } from '@core/common/interface/IResponse';

export class NotifcationResponse implements IResponse<NotifcationResponseJson> {
  private id: number;
  private title: string;
  private content: string;
  private type: NotificationType;
  private user: User;
  private isRead: boolean;
  private redirectUrl: string;
  private createdAt: Date;
  private referenceData: string;

  constructor(
    id: number,
    title: string,
    content: string,
    type: NotificationType,
    isRead: boolean,
    redirect_url: string,
    created_at: Date,
    user: User = null,
    reference_data: string = null,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.type = type;
    this.isRead = isRead;
    this.redirectUrl = redirect_url;
    this.createdAt = created_at;
    this.user = user;
    this.referenceData = reference_data;
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
      notification.referenceData,
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
      reference_data: this.referenceData,
      created_at: this.createdAt,
    };
  }
}
