import { Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ORMSale } from '../../../infra/database/entities/ORMSale';
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
    } catch (e) {
      if (e instanceof QueryFailedError) {
        return Result.fail(new Error(e.message));
      }
      throw e;
    }
  }

  async findById(id: string): Promise<Result<Sale>> {
    const result = await this.findOne({
      where: { id: id },
      relations: ['customer', 'customer.address', 'items', 'items.product']
    });

    if (!result) {
      return Result.fail(new Error('not found'));
    }
    return Result.ok<Sale>(result.export());
  }


  async findOneEntity(where: object): Promise<Result<Sale>> {
    try {
      const result = await this.findOne({
        ...where,
        relations: ['customer', 'customer.address', 'items', 'items.product'],
        order: {
          createdAt: 'ASC'
        },
      });

      if (!result) {
        return Result.fail(new Error('not found'));
      }
      const Sale = result.export();
      return Result.ok(Sale);
    } catch (error) {
      return Result.fail(error);
    }
  }

  async filter(where: object): Promise<Result<Sale[]>> {
    const result = await this.find({
      ...where,
      relations: ['customer', 'customer.address', 'items', 'items.product']
    });
    const results = result.map((sale) => sale.export());
    return Result.ok(results);
  }

  async findEntity(where: object): Promise<Result<Sale[]>> {
    const result = await this.find({
      ...where,
      relations: ['customer', 'customer.address', 'items', 'items.product'],
      order: {
        createdAt: 'ASC'
      },
    });
    const results = result.map((Sale) => Sale.export());
    return Result.ok(results);
  }

  async deleteEntity(instance: Sale): Promise<Result<void>> {
    try {
      const entity = await this.findOne({
        where: { id: instance.id },
        relations: ['customer', 'customer.address', 'items', 'items.product']
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

  // async searchSales(params: SaleFilter, companyId: string): Promise<Result<Sale[]>> {
  //   const where: any = {};

  //   if (params.clientCpfCnpj) {
  //     where.customer = { ...where.customer, cpfCnpj: params.clientCpfCnpj };
  //   }

  //   if (params.clientName) {
  //     where.customer = {
  //       ...where.customer,
  //       name: ILike(`%${params.clientName}%`),
  //     };
  //   }

  //   if (params.clientPhone) {
  //     where.customer = { ...where.customer, phone: ILike(`%${params.clientPhone}%`), };
  //   }

  //   if (params.openingDate) {
  //     where.openingDate = params.openingDate;
  //   }

  //   if (params.osNumber) {
  //     where.number = params.osNumber;
  //   }

  //   if (params.serialNumber) {
  //     where.eletronic = { ...where.eletronic, serial: params.serialNumber };
  //   }

  //   const sales = await this.find({
  //     where: { ...where, companyId: companyId },
  //     relations: ['customer', 'eletronic', 'budget', 'customer.address', 'item', 'item.product'],
  //   });

  //   const results = sales.map((sale) => sale.export());
  //   return Result.ok(results);
  // }
}
