import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ORMBase } from './ORMBase';
import { Item } from '../../../sales-and-stock/domain/entities/Item';
import { ItemDTO } from '../../../sales-and-stock/DTO/ItemDTO';
import { Injectable } from '@nestjs/common';
import { ORMProduct } from './ORMProduct';

@Injectable()
@Entity('Item')
export class ORMItem extends ORMBase {
  @ManyToOne(() => ORMProduct, (product) => product.id)
  @JoinColumn({ name: 'productId' })
  product: ORMProduct;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  value: number;


  static import(instance: Item): ORMItem {
    const entity = new ORMItem();
    entity.id = instance.id;

    entity.product = ORMProduct.import(instance.product)
    entity.quantity = instance.quantity
    entity.value = instance.value

    entity.createdAt = instance.createdAt;
    entity.updatedAt = instance.updatedAt;
    entity.deletedAt = instance.deletedAt;

    return entity;
  }

  export(): Item {
    const dto: ItemDTO = {
      id: this.id,

      product: this.product.export().toDTO(),
      quantity: this.quantity,
      value: this.value,

      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null,
    };

    return Item.reconstitute(dto).data;
  }
}
