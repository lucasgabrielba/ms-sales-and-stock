import { Result } from '../../../../kernel/Result/Result';
import { AbstractApplicationService } from '../../../../kernel/application/service/AbstactApplicationService';
import { removeNulls } from '../../../../kernel/removeNulls/removeNullls';
import { ProductDomainService } from '../../domain/service/ProductDomainService';
import {
  Product,
  CreateProductPropsPrimitive,
  UpdateProductPropsPrimitive,
} from '../../domain/entities/Product';
import { ProductDTO } from '../../DTO/ProductDTO';

export class ProductApplicationService extends AbstractApplicationService<
  Product,
  ProductDTO,
  CreateProductPropsPrimitive,
  ProductDomainService
> {
  constructor(readonly manager: ProductDomainService) {
    super(manager);
  }

  async create(data: CreateProductPropsPrimitive): Promise<Result<Product>> {
    const result = await this.manager.createAndSave(data);

    if (result.isFailure()) {
      return Result.fail(result.error);
    }

    return result;
  }

  async updateEntity(
    id: string,
    data: UpdateProductPropsPrimitive,
  ): Promise<Result<Product>> {
    removeNulls(data);

    const entity = await this.getById(id);

    if (entity.isFailure()) {
      return Result.fail(new Error('não foi possivel resgatar Product'));
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

  async getById(id: string): Promise<Result<Product>> {
    const retrieved = await this.manager.get(id);
    if (retrieved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok(retrieved.data);
  }

  async get(where: object): Promise<Result<Product>> {
    const fetched = await this.manager.getOne(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<Product>(fetched.data);
  }

  async all(): Promise<Result<Product[]>> {
    const result = await this.manager.find();
    return result;
  }

  async filter(where: object): Promise<Result<Product[]>> {
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
    return Product.LABEL;
  }
}
