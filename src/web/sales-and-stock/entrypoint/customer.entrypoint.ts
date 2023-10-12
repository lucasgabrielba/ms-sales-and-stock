import { Injectable } from '@nestjs/common';
import { CustomerApplicationService } from '../../../sales-and-stock/application/service/CustomerApplicationService';
import { CustomerDomainService } from '../../../sales-and-stock/domain/service/CustomerDomainService';
import { CustomerRepository } from '../../../infra/database/repositories/CustomerRepository';
import { AddressEntrypoint } from './addressEntrypoint';

@Injectable()
export class CustomerEntrypoint {
  protected static instance: CustomerApplicationService;

  constructor(
    repository: CustomerRepository,
    addressEntrypoint: AddressEntrypoint,
  ) {
    if (!CustomerEntrypoint.instance) {
      const addressAppService = addressEntrypoint.getApplicationService();
      const domainService = new CustomerDomainService(repository);
      CustomerEntrypoint.instance = new CustomerApplicationService(
        domainService,
        addressAppService,
      );
    }
  }

  getApplicationService(): CustomerApplicationService {
    return CustomerEntrypoint.instance;
  }
}
