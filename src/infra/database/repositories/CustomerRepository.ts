import { Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ORMCustomer } from '../entities/ORMCustomer';
import { Result } from '../../../../kernel/Result/Result';
import { Customer } from '../../../sales-and-stock/domain/entities/Customer';
import { CustomerRepositoryInterface } from '../../../sales-and-stock/domain/repository/CustomerRepositoryInterface';

@Injectable()
export class CustomerRepository
  extends Repository<ORMCustomer>
  implements CustomerRepositoryInterface {
  constructor(dataSource: DataSource) {
    super(ORMCustomer, dataSource.createEntityManager());
  }

  async persist(instance: Customer): Promise<Result<void>> {
    try {
      await this.save(ORMCustomer.import(instance));
      return Result.ok();
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return Result.fail(new Error(error.message));
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Result<Customer>> {
    const result = await this.findOne({
      where: { id: id },
      relations: ['address'],
    });
    if (!result) {
      return Result.fail(new Error('not found'));
    }

    return Result.ok<Customer>(result.export());
  }

  async findOneEntity(where: object): Promise<Result<Customer>> {
    try {
      const result = await this.findOne({
        where: where,
        relations: ['address'],
      });
      if (!result) {
        return Result.fail(new Error('not found'));
      }

      const customer = result.export();
      return Result.ok(customer);
    } catch (error) {
      return Result.fail(error);
    }
  }
  async findEntity(): Promise<Result<Customer[]>> {
    const result = await this.find({ relations: ['address'] });
    const results = result.map((Customer) => Customer.export());
    return Result.ok(results);
  }

  async filter(where: object): Promise<Result<Customer[]>> {
    const result = await this.find({ ...where, relations: ['address'] });
    const results = result.map((Customer) => Customer.export());
    return Result.ok(results);
  }

  async deleteEntity(instance: Customer): Promise<Result<void>> {
    try {
      const entity = await this.findOne({
        where: { id: instance.id.toString() },
        relations: ['address'],
      });

      if (!entity) return Result.fail(new Error('invalid'));

      await this.softRemove(entity);

      return Result.ok<void>();
    } catch (e) {
      if (e instanceof QueryFailedError) {
        return Result.fail(new Error('invalid'));
      }

      throw e;
    }
  }
}
