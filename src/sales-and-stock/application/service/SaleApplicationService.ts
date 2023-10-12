import { Result } from '../../../../kernel/Result/Result';
import { AbstractApplicationService } from '../../../../kernel/application/service/AbstactApplicationService';
import { removeNulls } from '../../../../kernel/removeNulls/removeNullls';
import { SaleDomainService } from '../../domain/service/SaleDomainService';
import {
  Sale
} from '../../domain/entities/Sale';
import { CreateSalePropsPrimitive, UpdateSalePropsPrimitive } from '../../domain/entities/Sale';
import { SaleDTO } from '../../DTO/SaleDTO';
import { Item } from '../../domain/entities/Item';
import { CustomerApplicationService } from './CustomerApplicationService';
import { ItemApplicationService } from './ItemApplicationService';

export class SaleApplicationService extends AbstractApplicationService<
  Sale,
  SaleDTO,
  CreateSalePropsPrimitive,
  SaleDomainService
> {
  constructor(
    readonly manager: SaleDomainService,
    private readonly customerAppService: CustomerApplicationService,
    private readonly itemAppService: ItemApplicationService,
  ) {
    super(manager);
  }

  async create(data: CreateSalePropsPrimitive): Promise<Result<Sale>> {
    const customer = await this.customerAppService.getById(data.customerId);
    if (customer.isFailure()) {
      return Result.fail(customer.error);
    }

    let items: Item[] = [];
    for (const itemId of data.itemsId) {
      const item = await this.itemAppService.getById(itemId);
      if (item.isFailure()) {
        return Result.fail(item.error);
      }

      items.push(item.data)
    }

    const createData = {
      customer: customer.data,
      items: items,
      ...data
    }

    const result = await this.manager.createAndSave(createData);

    if (result.isFailure()) {
      return Result.fail(result.error);
    }

    return result;
  }

  async updateEntity(
    id: string,
    data: UpdateSalePropsPrimitive,
  ): Promise<Result<Sale>> {
    removeNulls(data);

    const entity = await this.getById(id);

    if (entity.isFailure()) {
      return Result.fail(new Error('não foi possivel resgatar Sale'));
    }

  }

  async getById(id: string): Promise<Result<Sale>> {
    const retrieved = await this.manager.get(id);
    if (retrieved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok(retrieved.data);
  }

  async get(where: object): Promise<Result<Sale>> {
    const fetched = await this.manager.getOne(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<Sale>(fetched.data);
  }

  async all(): Promise<Result<Sale[]>> {
    const result = await this.manager.find();
    return result;
  }

  async filter(where: object): Promise<Result<Sale[]>> {
    const fetched = await this.manager.filter(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível resgatar registros de "${this.getModelLabel()}".`,
        ),
      );
    }

    return Result.ok(fetched.data);
  }

  getModelLabel(): string {
    return Sale.LABEL;
  }
}
