import { get } from 'env-var';

export class CloudinaryConfig {
  public static readonly CLOUDINARY_NAME: string = get('CLOUDINARY_NAME')
    .default('dcaiizsie')
    .asString();
  public static readonly CLOUDINARY_API_KEY: string = get('CLOUDINARY_API_KEY')
    .default('997236949768394')
    .asString();
  public static readonly CLOUDINARY_API_SECRET: string = get('CLOUDINARY_API_SECRET')
    .default('mOT2ePdTJ-zYoiNlbh67MxKg-nE')
    .asString();
}
