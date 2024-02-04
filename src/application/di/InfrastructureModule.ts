import { DrizzleModule } from '@infrastructure/orm/DrizzleModule';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    DrizzleModule,
    JwtModule.register({
      global: true,
      secret: 'ABC',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class InfrastructureModule {}
