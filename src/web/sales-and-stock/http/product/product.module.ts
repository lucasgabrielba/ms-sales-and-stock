import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORMProduct } from '../../../../infra/database/entities/ORMProduct';

@Module({
  imports: [TypeOrmModule.forFeature([ORMProduct])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
