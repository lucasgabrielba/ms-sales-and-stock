import { Module, Global } from '@nestjs/common';
import { ORMCustomer } from './ORMCustomer';
import { ORMAddress } from './ORMAddress';
@Global()
@Module({
  providers: [ORMCustomer, ORMAddress],

  exports: [ORMCustomer, ORMAddress],
})
export class ORMModule {}
