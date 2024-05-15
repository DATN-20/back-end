import { NotificationType } from '@core/common/enum/NotificationType';
import { UserResponseJson } from '@core/module/user/entity/response/UserResponseJson';

export interface NotifcationResponseJson {
  id: number;
  title: string;
  content: string;
  type: NotificationType;
  user: UserResponseJson;
  is_read: boolean;
  redirect_url: string;
  created_at: Date;
}
