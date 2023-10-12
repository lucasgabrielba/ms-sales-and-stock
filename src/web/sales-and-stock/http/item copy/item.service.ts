import { Injectable } from '@nestjs/common';
import { ItemEntrypoint } from '../../entrypoint/item.entrypoint';
import { MemberPayload } from '../../utils/MemberPayload';
import { Result } from '../../../../../kernel/Result/Result';
import { ItemApplicationService } from '../../../../sales-and-stock/application/service/ItemApplicationService';
import { Item, CreateItemPropsPrimitive, UpdateItemPropsPrimitive } from '../../../../sales-and-stock/domain/entities/Item';

@Injectable()
export class ItemService {
  protected applicationService: ItemApplicationService;

  constructor(entrypoint: ItemEntrypoint) {
    this.applicationService = entrypoint.getApplicationService();
  }

  async listAllItem(member: MemberPayload): Promise<Result<Item[]>> {
    member;
    const result = await this.applicationService.all();
    return result;
  }

  async findOne(id: string, member: MemberPayload): Promise<Result<Item>> {
    member;
    const result = await this.applicationService.getById(id);
    return result;
  }

  // async findBy(
  //   data: FindItemBy,
  //   member: MemberPayload,
  // ): Promise<Result<Item[]>> {
  //   // const ismanager = validatePermission(member)
  //   // if (!ismanager) {
  //   //   return Result.fail(new UnauthorizedException('Voce não possui permissão'))
  //   // }
  //   const result = await this.applicationService.findBy(data, member);
  //   return result;
  // }

  async create(
    data: CreateItemPropsPrimitive,
    member: MemberPayload,
  ): Promise<Result<Item>> {
    member;
    const result = await this.applicationService.create(data);
    return result;
  }

  async update(
    id: string,
    data: UpdateItemPropsPrimitive,
    member: MemberPayload,
  ): Promise<Result<Item>> {
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
