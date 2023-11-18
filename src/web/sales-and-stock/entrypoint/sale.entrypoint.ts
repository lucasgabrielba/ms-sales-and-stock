import { Injectable } from '@nestjs/common';
import { SaleDomainService } from '../../../sales-and-stock/domain/service/SaleDomainService';
import { SaleRepository } from '../../../infra/database/repositories/SaleRepository';
import { CustomerEntrypoint } from './customer.entrypoint';
import { SaleApplicationService } from '../../../sales-and-stock/application/service/SaleApplicationService';
import { ItemEntrypoint } from './item.entrypoint';
import { NotificationApplicationService } from '../../../sales-and-stock/application/service/NotificationApplicationService';

@Injectable()
export class SaleEntrypoint {
  protected static instance: SaleApplicationService;

  constructor(
    repository: SaleRepository,
    customerEntrypoint: CustomerEntrypoint,
    itemEntrypoint: ItemEntrypoint,
  ) {
    if (!SaleEntrypoint.instance) {
      const customerAppService = customerEntrypoint.getApplicationService();
      const itemAppService = itemEntrypoint.getApplicationService();
      const notificationAppService = new NotificationApplicationService

      const domainService = new SaleDomainService(repository);

      SaleEntrypoint.instance = new SaleApplicationService(
        domainService,
        customerAppService,
        itemAppService,
        notificationAppService
      );
    }
  }

  getApplicationService(): SaleApplicationService {
    return SaleEntrypoint.instance;
  }
}
