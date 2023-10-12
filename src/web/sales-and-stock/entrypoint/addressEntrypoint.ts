import { Injectable } from '@nestjs/common';
import { AddressApplicationService } from '../../../sales-and-stock/application/service/AddressApplicationService';
import { AddressDomainService } from '../../../sales-and-stock/domain/service/AddressDomainService';
import { AddressRepository } from '../../../infra/database/repositories/AddressRepository';

@Injectable()
export class AddressEntrypoint {
  protected static instance: AddressApplicationService;

  constructor(repository: AddressRepository) {
    if (!AddressEntrypoint.instance) {
      const domainService = new AddressDomainService(repository);
      AddressEntrypoint.instance = new AddressApplicationService(domainService);
    }
  }

  getApplicationService(): AddressApplicationService {
    return AddressEntrypoint.instance;
  }
}
