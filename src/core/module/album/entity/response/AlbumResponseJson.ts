import { UserShortProfileResponseJson } from '@core/module/user/entity/response/UserShortProfileResponseJson';

export interface AlbumResponseJson {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  created_user: UserShortProfileResponseJson;
}
