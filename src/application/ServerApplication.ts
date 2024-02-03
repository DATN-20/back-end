import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RootModule } from './di/RootModule';
import { ApiServerConfig } from '@infrastructure/config/ApiServerConfig';
import { Logger } from '@nestjs/common';

export class ServerApplication {
  private readonly host: string = ApiServerConfig.HOST;
  private readonly port: number = ApiServerConfig.PORT;
  private readonly logger: Logger = new Logger(ServerApplication.name);

  public async run(): Promise<void> {
    const app: NestExpressApplication =
      await NestFactory.create<NestExpressApplication>(RootModule);

    await app
      .listen(this.port, this.host)
      .then(() => this.logger.log(`Server is listening in port ${this.port}`));
  }

  public static new(): ServerApplication {
    return new ServerApplication();
  }
}
