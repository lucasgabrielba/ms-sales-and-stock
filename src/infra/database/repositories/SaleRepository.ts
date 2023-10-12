import { Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ORMSale } from '../entities/ORMSale';
import { Result } from '../../../../kernel/Result/Result';
import { Sale } from '../../../sales-and-stock/domain/entities/Sale';
import { SaleRepositoryInterface } from '../../../sales-and-stock/domain/repository/SaleRepositoryInterface';

@Injectable()
export class SaleRepository
  extends Repository<ORMSale>
  implements SaleRepositoryInterface {
  constructor(dataSource: DataSource) {
    super(ORMSale, dataSource.createEntityManager());
  }

  async persist(instance: Sale): Promise<Result<void>> {
    try {
      await this.save(ORMSale.import(instance));
      return Result.ok();
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return Result.fail(new Error(error.message));
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Result<Sale>> {
    const result = await this.findOne({
      where: { id: id },
      relations: ['address'],
    });
    if (!result) {
      return Result.fail(new Error('not found'));
    }

    return Result.ok<Sale>(result.export());
  }

  async findOneEntity(where: object): Promise<Result<Sale>> {
    try {
      const result = await this.findOne({
        where: where,
        relations: ['address'],
      });
      if (!result) {
        return Result.fail(new Error('not found'));
      }

      const sale = result.export();
      return Result.ok(sale);
    } catch (error) {
      return Result.fail(error);
    }
  }
  async findEntity(): Promise<Result<Sale[]>> {
    const result = await this.find({ relations: ['address'] });
    const results = result.map((Sale) => Sale.export());
    return Result.ok(results);
  }

  async filter(where: object): Promise<Result<Sale[]>> {
    const result = await this.find({ ...where, relations: ['address'] });
    const results = result.map((Sale) => Sale.export());
    return Result.ok(results);
  }

  async deleteEntity(instance: Sale): Promise<Result<void>> {
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
