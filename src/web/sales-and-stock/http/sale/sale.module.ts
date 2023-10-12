import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORMSale } from '../../../../infra/database/entities/ORMSale';

@Module({
  imports: [TypeOrmModule.forFeature([ORMSale])],
  providers: [SaleService],
  controllers: [SaleController],
})
export class SaleModule {}
