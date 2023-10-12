import { Module, Global } from '@nestjs/common';
import { CustomerEntrypoint } from './customer.entrypoint';
import { AddressEntrypoint } from './addressEntrypoint';
import { ItemEntrypoint } from './item.entrypoint';
import { ProductEntrypoint } from './product.entrypoint';
import { SaleEntrypoint } from './sale.entrypoint';

@Global()
@Module({
  providers: [
    CustomerEntrypoint,
    AddressEntrypoint,
    ItemEntrypoint,
    ProductEntrypoint,
    SaleEntrypoint
  ],
  exports: [
    CustomerEntrypoint,
    AddressEntrypoint,
    ItemEntrypoint,
    ProductEntrypoint,
    SaleEntrypoint
  ],
})
export class EntrypointModule {}
