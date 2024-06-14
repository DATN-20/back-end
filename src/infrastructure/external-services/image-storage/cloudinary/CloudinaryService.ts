import { Exception } from '@core/common/exception/Exception';
import { IImageStorageService } from '@core/common/interface/IImageStorageService';
import { ImageError } from '@core/common/resource/error/ImageError';
import { CloudinaryConfig } from '@infrastructure/config/CloudinaryConfig';
import { Injectable, Logger } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService implements IImageStorageService {
  private logger: Logger;
  constructor() {
    cloudinary.config({
      cloud_name: CloudinaryConfig.CLOUDINARY_NAME,
      api_key: CloudinaryConfig.CLOUDINARY_API_KEY,
      api_secret: CloudinaryConfig.CLOUDINARY_API_SECRET,
    });
    this.logger = new Logger(CloudinaryService.name);
  }

  async uploadImages(imagesUpload: ImagesUpload): Promise<ImageUploadResult[]> {
    const upload_result: ImageUploadResult[] = [];
    for (const image of imagesUpload.images) {
      const result = await this.uploadImageWithBuffer(image.buffer);
      upload_result.push(result);
    }

    return upload_result;
  }

  async deleteImage(imageDelete: ImageDelete): Promise<void> {
    try {
      await cloudinary.uploader.destroy(imageDelete.storageIds);
    } catch (error) {
      this.logger.error('Failed to delete images:', error);
      throw new Exception(ImageError.FAIL_TO_DELETE_IMAGE);
    }
  }

  public async uploadImageWithBuffer(image_buffer: Buffer): Promise<ImageUploadResult> {
    try {
      const upload_result = await new Promise<UploadApiResponse | UploadApiErrorResponse>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ timeout: 120000 }, (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          });
          stream.end(image_buffer);
        },
      );

      return {
        url: upload_result.secure_url,
        id: upload_result.public_id,
      };
    } catch (error) {
      throw new Exception(ImageError.FAIL_TO_UPLOAD_IMAGE);
    }
  }
}
