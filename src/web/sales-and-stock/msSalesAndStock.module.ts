import { Module } from '@nestjs/common';
import { EntrypointModule } from './entrypoint/entrypoint.module';
import { AuthModule } from './http/auth/auth.module';
import { CustomerModule } from './http/customer/customer.module';
import { SaleModule } from './http/sale/sale.module';
import { ItemModule } from './http/item/item.module';
import { ProductModule } from './http/product/product.module';

@Module({
  imports: [
    CustomerModule,
    AuthModule,
    SaleModule,
    ItemModule,
    ProductModule
  ],
  providers: [EntrypointModule],
  exports: [
    CustomerModule,
    AuthModule,
    SaleModule,
    ItemModule,
    ProductModule
  ],
})
export class MSSalesAndStockModule {}
