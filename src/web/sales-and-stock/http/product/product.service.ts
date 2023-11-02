import { Injectable } from '@nestjs/common';
import { Result } from '../../../../../kernel/Result/Result';
import { ProductEntrypoint } from '../../entrypoint/product.entrypoint';
import { MemberPayload } from '../../utils/MemberPayload';
import { ProductApplicationService } from '../../../../sales-and-stock/application/service/ProductApplicationService';
import { Product, CreateProductPropsPrimitive, UpdateProductPropsPrimitive } from '../../../../sales-and-stock/domain/entities/Product';
import { SearchProductBy } from '../../utils/SearchProductBy';

@Injectable()
export class ProductService {
  protected applicationService: ProductApplicationService;

  constructor(entrypoint: ProductEntrypoint) {
    this.applicationService = entrypoint.getApplicationService();
  }

  async listAllProduct(member: MemberPayload): Promise<Result<Product[]>> {
    const result = await this.applicationService.all(member);
    return result;
  }

  async findOne(id: string, member: MemberPayload): Promise<Result<Product>> {
    member;
    const result = await this.applicationService.getById(id);
    return result;
  }

  // async findBy(
  //   data: FindProductBy,
  //   member: MemberPayload,
  // ): Promise<Result<Product[]>> {
  //   // const ismanager = validatePermission(member)
  //   // if (!ismanager) {
  //   //   return Result.fail(new UnauthorizedException('Voce não possui permissão'))
  //   // }
  //   const result = await this.applicationService.findBy(data, member);
  //   return result;
  // }

  async create(
    data: CreateProductPropsPrimitive,
    member: MemberPayload,
  ): Promise<Result<Product>> {
    member;
    const result = await this.applicationService.createEntity(data, member);
    return result;
  }

  async search(
    data: SearchProductBy,
    member: MemberPayload,
  ): Promise<Result<Product[]>> {
    return await this.applicationService.search(data, member);
  }

  async update(
    id: string,
    data: UpdateProductPropsPrimitive,
    member: MemberPayload,
  ): Promise<Result<Product>> {
    member;
    const result = await this.applicationService.updateEntity(id, data);
    return result;
  }

  async delete(id: string, member: MemberPayload): Promise<Result<boolean>> {
    member;
    const result = await this.applicationService.remove(id);
    return result;
  }
}
