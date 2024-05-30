import { NotificationType } from '@core/common/enum/NotificationType';
import { UserShortProfileResponseJson } from '@core/module/user/entity/response/UserShortProfileResponseJson';

export interface NotifcationResponseJson {
  id: number;
  title: string;
  content: string;
  type: NotificationType;
  user: UserShortProfileResponseJson;
  is_read: boolean;
  reference_data: string | null;
  created_at: Date;
}
