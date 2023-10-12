import { Module, Global } from '@nestjs/common';
import { CustomerRepository } from './CustomerRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORMCustomer } from '../entities/ORMCustomer';
import { ORMAddress } from '../entities/ORMAddress';
import { AddressRepository } from './AddressRepository';
import { ItemRepository } from './ItemRepository';
import { ProductRepository } from './ProductRepository';
import { SaleRepository } from './SaleRepository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ORMCustomer, ORMAddress])],

  providers: [
    CustomerRepository,
    AddressRepository,
    ItemRepository,
    ProductRepository,
    SaleRepository
  ],

  exports: [
    CustomerRepository,
    AddressRepository,
    ItemRepository,
    ProductRepository,
    SaleRepository
  ],
})
export class RepositoryModule {}
