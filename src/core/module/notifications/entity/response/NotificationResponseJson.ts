import { NotificationType } from '@core/common/enum/NotificationType';
import { UserShortProfileResponseJson } from '@core/module/user/entity/response/UserShortProfileResponseJson';
import { ApiProperty } from '@nestjs/swagger';

export class NotifcationResponseJson {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  type: NotificationType;
  @ApiProperty()
  user: UserShortProfileResponseJson;
  @ApiProperty()
  is_read: boolean;
  @ApiProperty()
  reference_data: string | null;
  @ApiProperty()
  created_at: Date;
}
