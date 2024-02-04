import { Global, Module } from '@nestjs/common';
import { dizzleProvider } from './DrizzleProvider';

@Global()
@Module({
  providers: [...dizzleProvider],
  exports: [...dizzleProvider],
})
export class DrizzleModule {}
