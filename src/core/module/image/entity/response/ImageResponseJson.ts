import { ImageType } from '@core/common/enum/ImageType';
import { UserResponseJson } from '@core/module/user/entity/response/UserResponseJson';

export interface ImageResponseJson {
  id: number;
  url: string;
  type: ImageType;
  prompt: string;
  ai_name: string;
  style: string;
  created_at: Date;
  created_user: UserResponseJson;
  is_liked: boolean;
  like_number: number;
  remove_background: string;
  upscale: string;
}
