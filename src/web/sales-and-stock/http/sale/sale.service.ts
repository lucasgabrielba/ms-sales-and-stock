import { Injectable } from '@nestjs/common';
import {
  Sale,
  CreateSalePropsPrimitive,
  UpdateSalePropsPrimitive,
} from '../../../../sales-and-stock/domain/entities/Sale';
import { Result } from '../../../../../kernel/Result/Result';
import { SaleApplicationService } from '../../../../sales-and-stock/application/service/SaleApplicationService';
import { SaleEntrypoint } from '../../entrypoint/sale.entrypoint';
import { MemberPayload } from '../../utils/MemberPayload';
import { SearchBy } from '../../utils/SearchBy';

@Injectable()
export class SaleService {
  protected applicationService: SaleApplicationService;

  constructor(entrypoint: SaleEntrypoint) {
    this.applicationService = entrypoint.getApplicationService();
  }

  async listAllSale(member: MemberPayload): Promise<Result<Sale[]>> {
    member;
    const result = await this.applicationService.all(member);
    return result;
  }

  async findOne(id: string, member: MemberPayload): Promise<Result<Sale>> {
    member;
    const result = await this.applicationService.getById(id);
    return result;
  }

  async getByNumber(number: string, member: MemberPayload): Promise<Result<Sale>> {
    member;
    const result = await this.applicationService.getByNumber(number, member);
    return result;
  }

  async search(
    data: SearchBy,
    member: MemberPayload,
  ): Promise<Result<Sale[]>> {
    // const ismanager = validatePermission(member)
    // if (!ismanager) {
    //   return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    // }
    const result = await this.applicationService.search(data, member);
    return result;
  }

  async create(
    data: CreateSalePropsPrimitive,
    member: MemberPayload,
  ): Promise<Result<Sale>> {
    member;
    const result = await this.applicationService.create(data);
    return result;
  }

  async update(
    id: string,
    data: UpdateSalePropsPrimitive,
    member: MemberPayload,
  ): Promise<Result<Sale>> {
    member;
    const result = await this.applicationService.updateEntity(id, data, member);
    return result;
  }

  async delete(id: string, member: MemberPayload): Promise<Result<boolean>> {
    member;
    const result = await this.applicationService.remove(id);
    return result;
  }
}
