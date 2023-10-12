import { Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ORMAddress } from '../entities/ORMAddress';
import { Result } from '../../../../kernel/Result/Result';
import { Address } from '../../../sales-and-stock/domain/entities/Address';
import { AddressRepositoryInterface } from '../../../sales-and-stock/domain/repository/AddressRepositoryInterface';

@Injectable()
export class AddressRepository
  extends Repository<ORMAddress>
  implements AddressRepositoryInterface {
  constructor(dataSource: DataSource) {
    super(ORMAddress, dataSource.createEntityManager());
  }

  async persist(instance: Address): Promise<Result<void>> {
    try {
      await this.save(ORMAddress.import(instance));
      return Result.ok();
    } catch (e) {
      if (e instanceof QueryFailedError) {
        return Result.fail(new Error(e.message));
      }
      throw e;
    }
  }

  async findById(id: string): Promise<Result<Address>> {
    const result = await this.findOne({
      where: { id: id },
    });
    if (!result) {
      return Result.fail(new Error('not found'));
    }

    return Result.ok<Address>(result.export());
  }

  async findOneEntity(where: object): Promise<Result<Address>> {
    try {
      const result = await this.findOne({ where: where });
      if (!result) {
        return Result.fail(new Error('not found'));
      }

      const Address = result.export();
      return Result.ok(Address);
    } catch (error) {
      return Result.fail(error);
    }
  }
  async findEntity(): Promise<Result<Address[]>> {
    const result = await this.find();
    const results = result.map((Address) => Address.export());

    return Result.ok(results);
  }

  async deleteEntity(instance: Address): Promise<Result<void>> {
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
