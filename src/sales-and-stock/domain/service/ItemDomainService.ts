import { Result } from '../../../../kernel/Result/Result';
import { AbstractDomainService } from '../../../../kernel/domain/domainService/AbstractDomainService';
import { ItemDTO } from '../../DTO/ItemDTO';
import { Item, CreateItemProps } from '../entities/Item';

import { ItemRepositoryInterface } from "../repository/ItemRepositoryInterface"

export class ItemDomainService extends AbstractDomainService<
  Item,
  ItemDTO,
  CreateItemProps,
  ItemRepositoryInterface
> {
  constructor(protected repository: ItemRepositoryInterface) {
    super(repository);
  }

  async getOne(where: object): Promise<Result<Item>> {
    const fetched = await this.repository.findOneEntity(where);

    if (fetched.isFailure()) {
      return Result.fail(fetched.error);
    }

    return Result.ok<Item>(fetched.data);
  }

  async create(data: CreateItemProps): Promise<Result<Item>> {
    const created = Item.create(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Item>(created.data);
  }

  async update(data: ItemDTO): Promise<Result<Item>> {
    const built = await this.build(data);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir ${Item.LABEL} a partir dos dados informados.`,
        ),
      );
    }

    const instance = built.data;

    const saved = await this.save(instance);

    if (saved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível salvar ${Item.LABEL}".`),
      );
    }

    return Result.ok<Item>(instance);
  }

  async build(data: ItemDTO): Promise<Result<Item>> {
    const created = Item.reconstitute(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Item>(created.data);
  }
}
