import { RepositoryInterface } from '../../../../kernel/domain/repository/RepositoryInterface';
import { Address } from '../entities/Address';


export interface AddressRepositoryInterface
  extends RepositoryInterface<Address> {}
