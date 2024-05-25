import { Module } from '@nestjs/common';
import { AIFeatureServiceManager } from './AIFeatureServiceManager';
import { ComfyUIModule } from './comfyui/ComfyUIModule';

@Module({
  imports: [ComfyUIModule],

  providers: [AIFeatureServiceManager],
  exports: [AIFeatureServiceManager],
})
export class AIFeatureServiceModule {}
