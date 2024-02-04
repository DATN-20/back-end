import { Module } from '@nestjs/common';
import { InfrastructureModule } from './InfrastructureModule';
import { UserModule } from './UserModule';
import { AuthModule } from './AuthModule';

@Module({
  imports: [InfrastructureModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class RootModule {}
