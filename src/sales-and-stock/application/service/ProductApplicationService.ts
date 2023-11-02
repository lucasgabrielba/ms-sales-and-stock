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
import { MemberPayload } from '../../../web/sales-and-stock/utils/MemberPayload';
import { ILike } from 'typeorm';
import { SearchProductBy } from '../../../web/sales-and-stock/utils/SearchProductBy';

export class ProductApplicationService extends AbstractApplicationService<
  Product,
  ProductDTO,
  CreateProductPropsPrimitive,
  ProductDomainService
> {
  constructor(readonly manager: ProductDomainService) {
    super(manager);
  }

  async createEntity(data: CreateProductPropsPrimitive, member: MemberPayload): Promise<Result<Product>> {
    data = {
      ...data,
      companyId: member.companyId,
    }

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

  async all(member: MemberPayload): Promise<Result<Product[]>> {
    const result = await this.manager.find({ companyId: member.companyId });
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


  async search(data: SearchProductBy, member: MemberPayload): Promise<Result<Product[]>> {
    let where: any = { where: { companyId: member.companyId } }

    if (data.code && data.code !== '') {
      where = {
        where: {
          productCode: data.code,
          companyId: member.companyId
        }
      }
    }

    if (data.brand && data.brand !== '') {
      where = {
        where: {
          brand: ILike(`%${data.brand}%`),
          companyId: member.companyId
        }
      }
    }

    if (data.name && data.name !== '') {
      where = {
        where: {
          name: ILike(`%${data.name}%`),
          companyId: member.companyId
        }
      }
    }

    if (data.model && data.model !== '') {
      where = {
        where: {
          model: ILike(`%${data.model}%`),
          companyId: member.companyId
        }
      }
    }

    const result = await this.manager.filter({
      ...where
    });

    if (result.isFailure()) {
      return Result.fail(result.error);
    }

    return result;

  }

  getModelLabel(): string {
    return Product.LABEL;
  }
}
