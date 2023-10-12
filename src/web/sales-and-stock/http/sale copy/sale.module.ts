import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORMSale } from '../../../../infra/database/entities/ORMSale';
import { SaleService } from '../sale/sale.service';
import { SaleController } from '../sale/sale.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ORMSale])],
  providers: [SaleService],
  controllers: [SaleController],
})
export class SaleModule {}
