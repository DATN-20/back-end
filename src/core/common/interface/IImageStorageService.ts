export interface IImageStorageService {
  uploadImages(imagesUpload: ImagesUpload): Promise<ImageUploadResult[]>;
  deleteImage(images: ImageDelete): Promise<void>;
}
