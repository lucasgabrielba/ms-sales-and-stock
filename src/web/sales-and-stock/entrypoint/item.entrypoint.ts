import { Injectable } from '@nestjs/common';
import { ItemApplicationService } from '../../../sales-and-stock/application/service/ItemApplicationService';
import { ItemRepository } from '../../../infra/database/repositories/ItemRepository';
import { ItemDomainService } from '../../../sales-and-stock/domain/service/ItemDomainService';
import { ProductEntrypoint } from './product.entrypoint';

@Injectable()
export class ItemEntrypoint {
  protected static instance: ItemApplicationService;

  constructor(
    repository: ItemRepository,
    productEntrypoint: ProductEntrypoint,
  ) {
    if (!ItemEntrypoint.instance) {
      const productAppService = productEntrypoint.getApplicationService();
      const domainService = new ItemDomainService(repository);
      ItemEntrypoint.instance = new ItemApplicationService(
        domainService,
        productAppService
      );
    }
  }

  getApplicationService(): ItemApplicationService {
    return ItemEntrypoint.instance;
  }
}
