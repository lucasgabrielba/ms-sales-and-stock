import { RepositoryInterface } from '../../../../kernel/domain/repository/RepositoryInterface';
import { Sale } from '../entities/Sale';


export interface SaleRepositoryInterface
  extends RepositoryInterface<Sale> {}
