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
export class GenerateImageConsumer implements IConsumer<JobData, Buffer[]> {
  constructor(
    private readonly imageService: ImageService,
    private readonly generationService: GenerationService,
    private readonly generateImageService: GenerateImageService,
  ) {}

  @Process()
  async process(job: Job<JobData>): Promise<Buffer[]> {
    if (job.data.generateInputs instanceof GenerateByImagesStyleInputs) {
      return this.generateImageService.handleGenerateImageByImagesStyle(
        job.data.userId,
        job.data.generateInputs,
      );
    }

    switch (job.data.type) {
      case ImageType.TEXT_TO_IMG:
        return this.generateImageService.handleGenerateTextToImg(
          job.data.userId,
          job.data.generateInputs,
        );
      case ImageType.IMG_TO_IMG:
        return this.generateImageService.handleGenerateImageToImage(
          job.data.userId,
          job.data.generateInputs,
        );
    }
  }

  @OnQueueFailed()
  async onFailed(job: Job<JobData>, error: any): Promise<void> {
    console.log(error);
    SystemLogger.error(error.message, {
      error_code: ErrorBaseSystem.INTERNAL_SERVER_ERROR.error_code,
      back_trace: error.trace,
    });
    await this.generationService.handleDeleteById(job.data.generateInputs.generationId);

    job.remove();
  }

  @OnQueueCompleted()
  async onCompleted(job: Job<JobData>, result: Buffer[]): Promise<void> {
    await this.generationService.handleChangeStatusOfGeneration(
      job.data.generateInputs.generationId,
      GenerationStatus.FINISHED,
    );

    if (job.data.generateInputs instanceof GenerateByImagesStyleInputs) {
      await this.imageService.handleCreateGenerateImagesByImagesStyle(
        job.data.userId,
        result,
        job.data.type,
        job.data.generateInputs,
      );
    } else {
      await this.imageService.handleCreateGenerateImages(
        job.data.userId,
        result,
        job.data.type,
        job.data.generateInputs,
      );
    }

    ApiLogger.info(job.data.type, {
      user_id: job.data.userId,
      api_endpoint: job.data.endpoint,
      log_type: LogType.API,
    });

    job.remove();
  }
}
