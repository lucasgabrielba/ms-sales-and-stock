import { Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ORMItem } from '../entities/ORMItem';
import { Result } from '../../../../kernel/Result/Result';
import { Item } from '../../../sales-and-stock/domain/entities/Item';
import { ItemRepositoryInterface } from '../../../sales-and-stock/domain/repository/ItemRepositoryInterface';

@Injectable()
export class ItemRepository
  extends Repository<ORMItem>
  implements ItemRepositoryInterface {
  constructor(dataSource: DataSource) {
    super(ORMItem, dataSource.createEntityManager());
  }

  async persist(instance: Item): Promise<Result<void>> {
    try {
      await this.save(ORMItem.import(instance));
      return Result.ok();
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return Result.fail(new Error(error.message));
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Result<Item>> {
    const result = await this.findOne({
      where: { id: id },
      relations: ['product'],
    });
    if (!result) {
      return Result.fail(new Error('not found'));
    }

    return Result.ok<Item>(result.export());
  }

  async findOneEntity(where: object): Promise<Result<Item>> {
    try {
      const result = await this.findOne({
        where: where,
        relations: ['product'],
      });
      if (!result) {
        return Result.fail(new Error('not found'));
      }

      const item = result.export();
      return Result.ok(item);
    } catch (error) {
      return Result.fail(error);
    }
  }
  async findEntity(): Promise<Result<Item[]>> {
    const result = await this.find({ relations: ['product'] });
    const results = result.map((Item) => Item.export());
    return Result.ok(results);
  }

  async filter(where: object): Promise<Result<Item[]>> {
    const result = await this.find({ ...where, relations: ['product'] });
    const results = result.map((Item) => Item.export());
    return Result.ok(results);
  }

  async deleteEntity(instance: Item): Promise<Result<void>> {
    try {
      const entity = await this.findOne({
        where: { id: instance.id.toString() },
        relations: ['product'],
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
