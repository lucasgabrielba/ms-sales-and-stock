import { RepositoryInterface } from '../../../../kernel/domain/repository/RepositoryInterface';
import { Product } from '../entities/Product';

export interface ProductRepositoryInterface
  extends RepositoryInterface<Product> {}
