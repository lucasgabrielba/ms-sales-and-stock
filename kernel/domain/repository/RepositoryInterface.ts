import { Result } from '../../Result/Result';

export interface RepositoryInterface<Entity> {
  persist(instance: Entity): Promise<Result<void>>;

  findById(id: string): Promise<Result<Entity | undefined>>;

  findOneEntity(where: object): Promise<Result<Entity | undefined>>;

  findEntity(where?: object): Promise<Result<Entity[]>>;


  deleteEntity(instance: Entity): Promise<Result<void>>;
}
