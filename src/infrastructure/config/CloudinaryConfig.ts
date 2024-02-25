import { get } from 'env-var';

export class CloudinaryConfig {
  public static readonly CLOUDINARY_NAME: string = get('CLOUDINARY_NAME')
    .default('dw8lzl4fm')
    .asString();
  public static readonly CLOUDINARY_API_KEY: string = get('CLOUDINARY_API_KEY')
    .default('236253541339697')
    .asString();
  public static readonly CLOUDINARY_API_SECRET: string = get('CLOUDINARY_API_SECRET')
    .default('HsK9GE2kpdVL4t3UyzXSNX3M4')
    .asString();
}
