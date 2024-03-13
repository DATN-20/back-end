import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AiModelService } from './AiModelService';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { CreateAiModelRequest } from './entity/request/CreateAiModelRequest';

@UseGuards(AuthGuard)
@Controller('ai-models')
export class AiModelController {
  constructor(private readonly aiModelService: AiModelService) {}

  @Post()
  async createNewAiModel(@Body() data: CreateAiModelRequest) {
    const result = await this.aiModelService.handleCreateNewAiModel(data);

    return result.toJson();
  }
}
