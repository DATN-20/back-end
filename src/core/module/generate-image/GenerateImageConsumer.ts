import { IConsumer } from '@core/common/interface/IConsumer';
import { OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ImageService } from '../image/ImageService';
import { GenerateInputs } from './entity/request/GenerateInputs';
import { ImageType } from '@core/common/enum/ImageType';
import { GenerationService } from '../generation/GenerationService';
import { GenerationStatus } from '@core/common/enum/GenerationStatus';
import SystemLogger from '@core/common/logger/SystemLoggerService';
import { ErrorBaseSystem } from '@core/common/resource/error/ErrorBase';
import ApiLogger from '@core/common/logger/ApiLoggerService';
import { LogType } from '@core/common/enum/LogType';
import { GENERATIONS_CHANNEL } from '@infrastructure/message-queue/QueueNameConstant';
import { GenerateImageService } from './GenerateImageService';
import { GenerateByImagesStyleInputs } from './entity/request/GenerateImageByImagesStyleInputs';

interface JobData {
  userId: number;
  generateInputs: GenerateInputs | GenerateByImagesStyleInputs;
  type: ImageType;
  endpoint: string;
}

@Processor(GENERATIONS_CHANNEL)
export class GenerateImageConsumer implements IConsumer<JobData, void> {
  constructor(
    private readonly imageService: ImageService,
    private readonly generationService: GenerationService,
    private readonly generateImageService: GenerateImageService,
  ) {}

  @Process()
  async process(job: Job<JobData>): Promise<void> {
    let array_buffer = [];
    if (job.data.generateInputs instanceof GenerateByImagesStyleInputs) {
      array_buffer = await this.generateImageService.handleGenerateImageByImagesStyle(
        job.data.userId,
        job.data.generateInputs,
      );
      await this.imageService.handleCreateGenerateImagesByImagesStyle(
        job.data.userId,
        array_buffer,
        job.data.type,
        job.data.generateInputs,
      );
      return;
    }

    switch (job.data.type) {
      case ImageType.TEXT_TO_IMG:
        array_buffer = await this.generateImageService.handleGenerateTextToImg(
          job.data.userId,
          job.data.generateInputs,
        );
        break;
      case ImageType.IMG_TO_IMG:
        array_buffer = await this.generateImageService.handleGenerateImageToImage(
          job.data.userId,
          job.data.generateInputs,
        );
    }

    await this.imageService.handleCreateGenerateImages(
      job.data.userId,
      array_buffer,
      job.data.type,
      job.data.generateInputs,
    );
  }

  @OnQueueFailed()
  async onFailed(job: Job<JobData>, error: any): Promise<void> {
    SystemLogger.error(error.message, {
      error_code: ErrorBaseSystem.INTERNAL_SERVER_ERROR.error_code,
      back_trace: error.trace,
    });
    await this.generationService.handleDeleteById(job.data.generateInputs.generationId);

    job.remove();
  }

  @OnQueueCompleted()
  async onCompleted(job: Job<JobData>, result: void): Promise<void> {
    await this.generationService.handleChangeStatusOfGeneration(
      job.data.generateInputs.generationId,
      GenerationStatus.FINISHED,
    );

    ApiLogger.info(job.data.type, {
      user_id: job.data.userId,
      api_endpoint: job.data.endpoint,
      log_type: LogType.API,
    });

    job.remove();
  }
}
