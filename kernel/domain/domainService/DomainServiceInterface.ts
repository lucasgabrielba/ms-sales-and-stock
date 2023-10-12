import { Result } from '../../Result/Result';

export interface DomainServiceInterface<Model, DTO, CreateProps> {
  create(data: CreateProps): Promise<Result<Model>>;

  build(data: DTO): Promise<Result<Model>>;

  save(instance: Model): Promise<Result<void>>;

  createAndSave(data: CreateProps): Promise<Result<Model>>;

  get(id: string): Promise<Result<Model>>;

  getOne(where: object): Promise<Result<Model>>;

  filter(where?: object): Promise<Result<Model[]>>;

  remove(instance: Model): Promise<Result<void>>;
}
