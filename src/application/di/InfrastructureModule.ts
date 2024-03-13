import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { UserRepository } from '@core/module/user/UserRepository';
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
  providers: [JwtUtil, UserRepository],
  exports: [JwtUtil, UserRepository],
})
export class InfrastructureModule {}
