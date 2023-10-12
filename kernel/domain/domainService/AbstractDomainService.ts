import { Result } from '../../Result/Result';
import { DomainServiceInterface } from './DomainServiceInterface';

export abstract class AbstractDomainService<Model, DTO, CreateProps, Repository>
  implements DomainServiceInterface<Model, DTO, CreateProps>
{
  constructor(protected repository: Repository) {}

  async filter(where?: object): Promise<Result<Model[]>> {
    const fetched = await (this.repository as any).filter(where);

    if (fetched.isFailure()) {
      return Result.fail(fetched.error);
    }

    return Result.ok<Model[]>(fetched.data);
  }

  async find(where?: object): Promise<Result<Model[]>> {
    const fetched = await (this.repository as any).findEntity(where);

    if (fetched.isFailure()) {
      return Result.fail(fetched.error);
    }

    return Result.ok<Model[]>(fetched.data);
  }

  async get(id: string): Promise<Result<Model>> {
    const fetched = await (this.repository as any).findById(id);

    if (fetched.isFailure()) {
      return Result.fail(fetched.error);
    }

    return Result.ok<Model>(fetched.data);
  }

  async getOne(where: object): Promise<Result<Model>> {
    const fetched = await (this.repository as any).findOneEntity(where);

    if (fetched.isFailure()) {
      return Result.fail(fetched.error);
    }

    return Result.ok<Model>(fetched.data);
  }

  abstract create(data: CreateProps): Promise<Result<Model>>;

  abstract build(data: DTO): Promise<Result<Model>>;

  async save(instance: Model): Promise<Result<void>> {
    const saved = await (this.repository as any).persist(instance);

    if (saved.isFailure()) {
      return Result.fail(saved.error);
    }

    return Result.ok<void>();
  }

  async createAndSave(data: CreateProps): Promise<Result<Model>> {
    const created = await this.create(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    const instance = created.data;
    const saved = await this.save(instance);
    // const saved = await (this.repository as any).persist(instance);
    if (saved.isFailure()) {
      return Result.fail(saved.error);
    }

    return Result.ok<Model>(instance);
  }

  async remove(instance: Model): Promise<Result<void>> {
    const deleted = await (this.repository as any).deleteEntity(instance);

    if (deleted.isFailure()) {
      return Result.fail(deleted.error);
    }

    return Result.ok<void>();
  }
}
