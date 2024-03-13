import { AiModelController } from '@core/module/ai-models/AiModelController';
import { AiModelRepository } from '@core/module/ai-models/AiModelRepository';
import { AiModelService } from '@core/module/ai-models/AiModelService';
import { Module } from '@nestjs/common';
import { InfrastructureModule } from './InfrastructureModule';

@Module({
  imports: [InfrastructureModule],
  controllers: [AiModelController],
  providers: [AiModelService, AiModelRepository],
  exports: [AiModelService, AiModelRepository],
})
export class AiModelModule {}
