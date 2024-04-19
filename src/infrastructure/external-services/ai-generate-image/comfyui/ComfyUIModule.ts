import { Module } from '@nestjs/common';
import { ComfyUIApi } from './ComfyUIApi';
import { ComfyUIConverter } from './ComfyUIConverter';
import { ComfyUIControlNet } from './control-net/ComfyUIControlNet';
import { ComfyUIFeature } from './ComfyUIFeature';
import { ComfyUIUpscale } from './upscale/ComfyUIUpscale';
import { ComfyUIValidator } from './ComfyUIValidator';
import { HttpModule } from '@nestjs/axios';
import { ComfyUIService } from './ComfyUIService';
import { ComfyUIUnclip } from './unclip/ComfyUIUnclip';

@Module({
  imports: [HttpModule],
  providers: [
    ComfyUIApi,
    ComfyUIValidator,
    ComfyUIConverter,
    ComfyUIControlNet,
    ComfyUIFeature,
    ComfyUIUpscale,
    ComfyUIService,
    ComfyUIUnclip,
  ],
  exports: [ComfyUIService],
})
export class ComfyUIModule {}
