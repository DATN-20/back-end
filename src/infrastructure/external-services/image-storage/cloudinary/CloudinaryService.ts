import { Exception } from '@core/common/exception/Exception';
import { IImageStorageService } from '@core/common/interface/IImageStorageService';
import { ImageError } from '@core/common/resource/error/ImageError';
import { CloudinaryConfig } from '@infrastructure/config/CloudinaryConfig';
import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService implements IImageStorageService {
  constructor() {
    cloudinary.config({
      cloud_name: CloudinaryConfig.CLOUDINARY_NAME,
      api_key: CloudinaryConfig.CLOUDINARY_API_KEY,
      api_secret: CloudinaryConfig.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImages(imagesUpload: ImagesUpload): Promise<ImageUploadResult[]> {
    const uploadResults: ImageUploadResult[] = [];
    for (const image of imagesUpload.images) {
      const result = await this.uploadImage(image.buffer);
      uploadResults.push(result);
    }

    return uploadResults;
  }

  async deleteImage(imageDelete: ImageDelete) {
    try {
      await cloudinary.uploader.destroy(imageDelete.storageIds);
    } catch (error) {
      console.error('Failed to delete images:', error);
      throw new Exception(ImageError.FAIL_TO_DELETE_IMAGE);
    }
  }

  private async uploadImage(imageBuffer: Buffer): Promise<ImageUploadResult> {
    try {
      const uploadResult = await new Promise<UploadApiResponse | UploadApiErrorResponse>(
        (resolve) => {
          cloudinary.uploader
            .upload_stream((error, uploadResult) => {
              return resolve(uploadResult);
            })
            .end(imageBuffer);
        },
      );
      return {
        url: uploadResult.secure_url,
        id: uploadResult.public_id,
      };
    } catch (error) {
      console.log(error);
      throw new Exception(ImageError.FAIL_TO_UPLOAD_IMAGE);
    }
  }
}
