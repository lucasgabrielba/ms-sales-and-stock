import { Injectable } from '@nestjs/common';
import { ProductApplicationService } from '../../../sales-and-stock/application/service/ProductApplicationService';
import { ProductDomainService } from '../../../sales-and-stock/domain/service/ProductDomainService';
import { ProductRepository } from '../../../infra/database/repositories/ProductRepository';

@Injectable()
export class ProductEntrypoint {
  protected static instance: ProductApplicationService;

  constructor(
    repository: ProductRepository,
  ) {
    if (!ProductEntrypoint.instance) {
      const domainService = new ProductDomainService(repository);
      ProductEntrypoint.instance = new ProductApplicationService(
        domainService
      );
    }
  }

  getApplicationService(): ProductApplicationService {
    return ProductEntrypoint.instance;
  }
}
