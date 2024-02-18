import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/CloudinaryService';

@Module({
  providers: [
    {
      provide: 'ImageStorageService',
      useClass: CloudinaryService,
    },
  ],
  exports: ['ImageStorageService'],
})
export class ImageStorageModule {}
