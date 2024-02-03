import { Module } from '@nestjs/common';
import { dizzleProvider } from './DrizzleProvider';

@Module({
  providers: [...dizzleProvider],
  exports: [...dizzleProvider],
})
export class DrizzleModule {}
