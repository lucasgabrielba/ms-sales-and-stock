import { RepositoryInterface } from '../../../../kernel/domain/repository/RepositoryInterface';
import { Item } from '../entities/Item';

export interface ItemRepositoryInterface
  extends RepositoryInterface<Item> {}
