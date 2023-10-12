import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORMCustomer } from '../../../../infra/database/entities/ORMCustomer';

@Module({
  imports: [TypeOrmModule.forFeature([ORMCustomer])],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}
