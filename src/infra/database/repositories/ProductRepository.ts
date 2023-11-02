import { Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ORMProduct } from '../entities/ORMProduct';
import { Result } from '../../../../kernel/Result/Result';
import { Product } from '../../../sales-and-stock/domain/entities/Product';
import { ProductRepositoryInterface } from '../../../sales-and-stock/domain/repository/ProductRepositoryInterface';

@Injectable()
export class ProductRepository
  extends Repository<ORMProduct>
  implements ProductRepositoryInterface {
  constructor(dataSource: DataSource) {
    super(ORMProduct, dataSource.createEntityManager());
  }

  async persist(instance: Product): Promise<Result<void>> {
    try {
      await this.save(ORMProduct.import(instance));
      return Result.ok();
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return Result.fail(new Error(error.message));
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Result<Product>> {
    const result = await this.findOne({
      where: { id: id },

    });
    if (!result) {
      return Result.fail(new Error('not found'));
    }

    return Result.ok<Product>(result.export());
  }

  async findOneEntity(where: object): Promise<Result<Product>> {
    try {
      const result = await this.findOne({
        where: where,

      });
      if (!result) {
        return Result.fail(new Error('not found'));
      }

      const product = result.export();
      return Result.ok(product);
    } catch (error) {
      return Result.fail(error);
    }
  }
  async findEntity(where): Promise<Result<Product[]>> {
    const result = await this.find({ where: where });
    const results = result.map((Product) => Product.export());
    return Result.ok(results);
  }

  async filter(where: object): Promise<Result<Product[]>> {
    const result = await this.find({ ...where, });
    const results = result.map((Product) => Product.export());
    return Result.ok(results);
  }

  async deleteEntity(instance: Product): Promise<Result<void>> {
    try {
      const entity = await this.findOne({
        where: { id: instance.id.toString() },

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
