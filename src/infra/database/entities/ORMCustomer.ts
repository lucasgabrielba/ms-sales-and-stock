import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ORMBase } from './ORMBase';
import { Customer } from '../../../sales-and-stock/domain/entities/Customer';
import { CustomerDTO } from '../../../sales-and-stock/DTO/CustomerDTO';
import { Injectable } from '@nestjs/common';
import { ORMAddress } from './ORMAddress';

@Injectable()
@Entity('Customer')
export class ORMCustomer extends ORMBase {
  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  companyId: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  cpfCnpj: string;

  @Column({ nullable: true })
  whatsapp: string;

  @OneToOne(() => ORMAddress, (address) => address.customer)
  @JoinColumn({ name: 'addressId' })
  address: ORMAddress;

  static import(instance: Customer): ORMCustomer {
    const entity = new ORMCustomer();
    entity.id = instance.id;

    entity.name = instance.name;
    entity.email = instance.email;
    entity.cpfCnpj = instance.cpfCnpj;
    entity.whatsapp = instance.whatsapp;
    entity.phone = instance.phone;
    entity.companyId = instance.companyId;
    entity.address = ORMAddress.import(instance.address);

    entity.createdAt = instance.createdAt;
    entity.updatedAt = instance.updatedAt;
    entity.deletedAt = instance.deletedAt;

    return entity;
  }

  export(): Customer {
    const dto: CustomerDTO = {
      id: this.id,

      name: this.name,
      email: this.email,
      cpfCnpj: this.cpfCnpj ?? null,
      whatsapp: this.whatsapp,
      phone: this.phone,
      companyId: this.companyId,
      address: this.address.export().toDTO(),

      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null,
    };

    return Customer.reconstitute(dto).data;
  }
}
