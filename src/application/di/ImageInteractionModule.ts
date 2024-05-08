import { ImageInteractionRepository } from '@core/module/images-interaction/ImageInteractionRepository';
import { ImageInteractionService } from '@core/module/images-interaction/ImageInteractionService';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [ImageInteractionService, ImageInteractionRepository],
  exports: [ImageInteractionService, ImageInteractionRepository],
})
export class ImageInteractionModule {}
