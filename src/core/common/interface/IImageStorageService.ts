export interface IImageStorageService {
  uploadImages(imagesUpload: ImagesUpload): Promise<ImageUploadResult[]>;
  deleteImage(images: ImageDelete): Promise<void>;
  uploadImageWithBuffer(image_buffer: Buffer): Promise<ImageUploadResult>;
}
