import { Result } from '../../../../kernel/Result/Result';
import { AbstractDomainService } from '../../../../kernel/domain/domainService/AbstractDomainService';
import { ProductDTO } from '../../DTO/ProductDTO';
import { Product, CreateProductProps } from '../entities/Product';

import { ProductRepositoryInterface } from "../repository/ProductRepositoryInterface"

export class ProductDomainService extends AbstractDomainService<
  Product,
  ProductDTO,
  CreateProductProps,
  ProductRepositoryInterface
> {
  constructor(protected repository: ProductRepositoryInterface) {
    super(repository);
  }

  async getOne(where: object): Promise<Result<Product>> {
    const fetched = await this.repository.findOneEntity(where);

    if (fetched.isFailure()) {
      return Result.fail(fetched.error);
    }

    return Result.ok<Product>(fetched.data);
  }

  async create(data: CreateProductProps): Promise<Result<Product>> {
    const created = Product.create(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Product>(created.data);
  }

  async update(data: ProductDTO): Promise<Result<Product>> {
    const built = await this.build(data);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir ${Product.LABEL} a partir dos dados informados.`,
        ),
      );
    }

    const instance = built.data;

    const saved = await this.save(instance);

    if (saved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível salvar ${Product.LABEL}".`),
      );
    }

    return Result.ok<Product>(instance);
  }

  async build(data: ProductDTO): Promise<Result<Product>> {
    const created = Product.reconstitute(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Product>(created.data);
  }
}
