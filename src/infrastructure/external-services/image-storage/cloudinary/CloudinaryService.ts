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
    const uploadResults: ImageUploadResult[] = [];
    for (const image of imagesUpload.images) {
      const result = await this.uploadImageWithBuffer(image.buffer);
      uploadResults.push(result);
    }

    return uploadResults;
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
      const uploadResult = await new Promise<UploadApiResponse | UploadApiErrorResponse>(
        resolve => {
          cloudinary.uploader
            .upload_stream((_error, uploadResult) => {
              return resolve(uploadResult);
            })
            .end(image_buffer);
        },
      );

      return {
        url: uploadResult.secure_url,
        id: uploadResult.public_id,
      };
    } catch (error) {
      throw new Exception(ImageError.FAIL_TO_UPLOAD_IMAGE);
    }
  }
}
