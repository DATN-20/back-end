import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RootModule } from './di/RootModule';
import { ApiServerConfig } from '@infrastructure/config/ApiServerConfig';
import { HttpException, HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { Exception } from '@core/common/exception/Exception';
import { ErrorBaseSystem } from '@core/common/resource/error/ErrorBase';
import { ExceptionFilterGlobal } from '@core/common/exception-filter/ExceptionFilterGlobal';

export class ServerApplication {
  private readonly host: string = ApiServerConfig.HOST;
  private readonly port: number = ApiServerConfig.PORT;
  private readonly logger: Logger = new Logger(ServerApplication.name);

  public async run(): Promise<void> {
    const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(
      RootModule,
    );
    app.setGlobalPrefix('api/v1');
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        exceptionFactory(_errors) {
          throw new Exception(ErrorBaseSystem.VALIDATION_REQUEST_DATA_FAILED);
        },
      }),
    );
    app.useGlobalFilters(new ExceptionFilterGlobal());
    await app
      .listen(this.port, this.host)
      .then(() => this.logger.log(`Server is listening in port ${this.port}`));
  }

  public static new(): ServerApplication {
    return new ServerApplication();
  }
}
