import { Injectable } from '@nestjs/common';
import { CustomerEntrypoint } from '../../entrypoint/customer.entrypoint';
import { MemberPayload } from '../../utils/MemberPayload';
import { Result } from '../../../../../kernel/Result/Result';
import { CustomerApplicationService } from '../../../../sales-and-stock/application/service/CustomerApplicationService';
import {
  Customer,
  CreateCustomerPropsPrimitive,
  UpdateCustomerPropsPrimitive,
} from '../../../../sales-and-stock/domain/entities/Customer';
import { FindCustomerBy } from '../../../../sales-and-stock/filters/FindCustomerBy';

@Injectable()
export class CustomerService {
  protected applicationService: CustomerApplicationService;

  constructor(entrypoint: CustomerEntrypoint) {
    this.applicationService = entrypoint.getApplicationService();
  }

  async listAllCustomer(actor: string): Promise<Result<Customer[]>> {
    // const ismanager = validatePermission(actor)
    // if (!ismanager) {
    //   return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    // }
    actor;
    const result = await this.applicationService.all();
    return result;
  }

  async findOne(id: string, actor: string): Promise<Result<Customer>> {
    // const ismanager = validatePermission(actor)
    // if (!ismanager) {
    //   return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    // }
    actor;
    const result = await this.applicationService.getById(id);
    return result;
  }

  async findBy(
    data: FindCustomerBy,
    member: MemberPayload,
  ): Promise<Result<Customer[]>> {
    // const ismanager = validatePermission(actor)
    // if (!ismanager) {
    //   return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    // }
    const result = await this.applicationService.findBy(data, member);
    return result;
  }

  async create(
    data: CreateCustomerPropsPrimitive,
    actor: string,
  ): Promise<Result<Customer>> {
    // const ismanager = validatePermission(actor)
    // if (!ismanager) {
    //   return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    // }
    actor;
    const result = await this.applicationService.create(data);
    return result;
  }

  async update(
    id: string,
    data: UpdateCustomerPropsPrimitive,
    actor: string,
  ): Promise<Result<Customer>> {
    // const ismanager = validatePermission(actor)
    // if (!ismanager) {
    //   return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    // }
    actor;
    const result = await this.applicationService.updateEntity(id, data);
    return result;
  }

  async delete(id: string, actor: string): Promise<Result<boolean>> {
    // const ismanager = validatePermission(actor)
    // if (!ismanager) {
    //   return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    // }
    actor;
    const result = await this.applicationService.remove(id);
    return result;
  }
}
