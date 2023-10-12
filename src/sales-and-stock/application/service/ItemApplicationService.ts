import { Result } from '../../../../kernel/Result/Result';
import { AbstractApplicationService } from '../../../../kernel/application/service/AbstactApplicationService';
import { removeNulls } from '../../../../kernel/removeNulls/removeNullls';
import { ItemDTO } from '../../DTO/ItemDTO';
import { Item, CreateItemPropsPrimitive, UpdateItemPropsPrimitive } from '../../domain/entities/Item';
import { ItemDomainService } from '../../domain/service/ItemDomainService';
import { ProductApplicationService } from './ProductApplicationService';

export class ItemApplicationService extends AbstractApplicationService<
  Item,
  ItemDTO,
  CreateItemPropsPrimitive,
  ItemDomainService
> {
  constructor(
    readonly manager: ItemDomainService,
    private readonly productAppService: ProductApplicationService,
  ) {
    super(manager);
  }

  async create(data: CreateItemPropsPrimitive): Promise<Result<Item>> {
    const product = await this.productAppService.getById(data.productId);

    if (product.isFailure()) {
      return Result.fail(product.error)
    }

    const createData = {
      product: product.data,
      quantity: data.quantity,
    }

    const result = await this.manager.createAndSave(createData);

    if (result.isFailure()) {
      return Result.fail(result.error);
    }

    return result;
  }

  async updateEntity(
    id: string,
    data: UpdateItemPropsPrimitive,
  ): Promise<Result<Item>> {
    removeNulls(data);

    const entity = await this.getById(id);

    if (entity.isFailure()) {
      return Result.fail(new Error('não foi possivel resgatar Item'));
    }

    const updateData = {
      ...entity.data.toDTO(),
      ...data,
    };

    const built = await this.manager.build(updateData);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir "${this.getModelLabel()}"` +
          ' a partir dos dados informados.',
        ),
      );
    }

    const instance = built.data;
    const saved = await this.manager.save(instance);

    if (saved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível salvar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok(instance);
  }

  async getById(id: string): Promise<Result<Item>> {
    const retrieved = await this.manager.get(id);
    if (retrieved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok(retrieved.data);
  }

  async get(where: object): Promise<Result<Item>> {
    const fetched = await this.manager.getOne(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<Item>(fetched.data);
  }

  async all(): Promise<Result<Item[]>> {
    const result = await this.manager.find();
    return result;
  }

  async filter(where: object): Promise<Result<Item[]>> {
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
    return Item.LABEL;
  }
}
