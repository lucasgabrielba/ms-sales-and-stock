import { RepositoryInterface } from '../../../../kernel/domain/repository/RepositoryInterface';
import { Customer } from '../entities/Customer';

export interface CustomerRepositoryInterface
  extends RepositoryInterface<Customer> {}
