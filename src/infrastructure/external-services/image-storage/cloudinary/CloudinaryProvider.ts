import { CloudinaryConfig } from '@infrastructure/config/CloudinaryConfig';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: (): ConfigOptions => {
    return cloudinary.config({
      cloud_name: CloudinaryConfig.CLOUDINARY_NAME,
      api_key: CloudinaryConfig.CLOUDINARY_API_KEY,
      api_secret: CloudinaryConfig.CLOUDINARY_API_SECRET,
    });
  },
};
