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
import { ComfyUIRemoveBackground } from './remove-background/ComfyUIRemoveBackground';
import { ControlNetModelMapping } from './control-net/ControlNetModelMapping';
import { ComfyUIIpadapter } from './ipadapter/ComfyUIIpadapter';
import { GenerationModule } from '@application/di/GenerationModule';

@Module({
  imports: [HttpModule, GenerationModule],
  providers: [
    ComfyUIApi,
    ComfyUIValidator,
    ComfyUIConverter,
    ComfyUIControlNet,
    ComfyUIFeature,
    ComfyUIUpscale,
    ComfyUIService,
    ComfyUIUnclip,
    ComfyUIRemoveBackground,
    ControlNetModelMapping,
    ComfyUIIpadapter,
  ],
  exports: [ComfyUIService],
})
export class ComfyUIModule {}
