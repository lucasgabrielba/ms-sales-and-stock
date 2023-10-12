
import { ORMItem } from './ORMItem';
import { ORMBase } from './ORMBase';
import { Injectable } from '@nestjs/common';
import { Entity, Column, OneToMany } from 'typeorm';
import { SaleDTO } from '../../../sales-and-stock/DTO/SaleDTO';
import { Sale } from '../../../sales-and-stock/domain/entities/Sale';
import { EStatusSale } from '../../../sales-and-stock/domain/enum/EStatusSale';
import { History } from '../../../sales-and-stock/domain/interfaces/History';
import { ORMCustomer } from './ORMCustomer';

@Entity('Sale')
@Injectable()
export class ORMSale extends ORMBase {
  @Column({ nullable: false })
  companyId: string;

  @Column({ nullable: false })
  value: number;

  @Column({ nullable: true })
  isAcceptSuggestedValue: boolean;

  @Column({ nullable: true })
  discount: number;

  @Column({ nullable: false })
  status: EStatusSale;

  @Column({ nullable: false })
  paid: number;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: true,
  })
  history: History[];

  @OneToMany(() => ORMItem, (item) => item.id)
  items: ORMItem[];

  @OneToMany(() => ORMCustomer, (customer) => customer.id)
  customer: ORMCustomer;

  static import(instance: Sale): ORMSale {
    const entity = new ORMSale();
    entity.id = instance.id;

    entity.companyId = instance.companyId;
    entity.value = instance.value;
    entity.isAcceptSuggestedValue = instance.isAcceptSuggestedValue;
    entity.discount = instance.discount;
    entity.status = instance.status;
    entity.paid = instance.paid;
    entity.items = instance.items.map((i) => ORMItem.import(i));
    entity.customer = ORMCustomer.import(instance.customer)
    entity.history = instance.history;

    entity.createdAt = instance.createdAt;
    entity.updatedAt = instance.updatedAt;
    entity.deletedAt = instance.deletedAt;

    return entity;
  }

  export(): Sale {
    const dto: SaleDTO = {
      id: this.id,

      companyId: this.companyId,
      value: this.value,
      isAcceptSuggestedValue: this.isAcceptSuggestedValue,
      discount: this.discount,
      status: this.status,
      paid: this.paid,
      items: this.items.map((i) => i.export().toDTO()),
      customer: this.customer.export().toDTO(),
      history: this.history,

      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null,
    };

    return Sale.reconstitute(dto).data;
  }
}
