import { Global, Module } from '@nestjs/common';
import { drizzleProvider } from './DrizzleProvider';

@Global()
@Module({
  providers: [...drizzleProvider],
  exports: [...drizzleProvider],
})
export class DrizzleModule {}
