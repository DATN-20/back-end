import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AiModelService } from './AiModelService';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { CreateAiModelRequest } from './entity/request/CreateAiModelRequest';
import { AiModelJson } from './entity/response/AiModelJson';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Api ai models')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('ai-models')
export class AiModelController {
  constructor(private readonly aiModelService: AiModelService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: AiModelJson })
  async createNewAiModel(@Body() data: CreateAiModelRequest): Promise<AiModelJson> {
    const result = await this.aiModelService.handleCreateNewAiModel(data);

    return result.toJson();
  }
}
