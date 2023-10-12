import { Result } from '../../Result/Result';

export interface ApplicationServiceInterface<Model, DTO, CreateProps> {
  /**
   * Retrieves a colection of model instances
   */
  all(): Promise<Result<Model[]>>;

  filter(where?: object): Promise<Result<Model[]>>;

  getById(id: string): Promise<Result<Model>>;

  get(where?: object): Promise<Result<Model>>;

  create(data: CreateProps, createdBy: string): Promise<Result<Model>>;

  update(data: DTO): Promise<Result<Model>>;
}
