import { Entity, Column } from 'typeorm';
import { ORMBase } from './ORMBase';
import { Product } from '../../../sales-and-stock/domain/entities/Product';
import { ProductDTO } from '../../../sales-and-stock/DTO/ProductDTO';
import { Injectable } from '@nestjs/common';

@Injectable()
@Entity('Product')
export class ORMProduct extends ORMBase {
  @Column({ nullable: true })
  companyId: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  productCode: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  salePrice: number;

  @Column({ nullable: true })
  costPrice: number;

  @Column({ nullable: true })
  supplier: string;


  static import(instance: Product): ORMProduct {
    const entity = new ORMProduct();
    entity.id = instance.id;

    entity.companyId = instance.companyId
    entity.quantity = instance.quantity
    entity.name = instance.name
    entity.productCode = instance.productCode
    entity.type = instance.type
    entity.brand = instance.brand
    entity.model = instance.model
    entity.salePrice = instance.salePrice
    entity.costPrice = instance.costPrice
    entity.supplier = instance.supplier

    entity.createdAt = instance.createdAt;
    entity.updatedAt = instance.updatedAt;
    entity.deletedAt = instance.deletedAt;

    return entity;
  }

  export(): Product {
    const dto: ProductDTO = {
      id: this.id,

      companyId: this.companyId,
      quantity: this.quantity,
      name: this.name,
      productCode: this.productCode,
      type: this.type,
      brand: this.brand,
      model: this.model,
      salePrice: this.salePrice,
      costPrice: this.costPrice,
      supplier: this.supplier,

      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null,
    };

    return Product.reconstitute(dto).data;
  }
}
