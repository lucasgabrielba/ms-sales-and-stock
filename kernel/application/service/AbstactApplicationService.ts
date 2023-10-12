import { Result } from '../../Result/Result';
import { ApplicationServiceInterface } from './ApplicationServiceInterface';

export abstract class AbstractApplicationService<
  Model,
  DTO,
  CreateProps,
  DomainServiceInterface,
> implements ApplicationServiceInterface<Model, DTO, CreateProps>
{
  constructor(readonly manager: DomainServiceInterface) {}

  abstract getModelLabel(): string;

  async all(where?: object): Promise<Result<Model[]>> {
    return this.filter(where as any);
  }

  async filter(where?: object): Promise<Result<Model[]>> {
    const fetched = await (this.manager as any).filter({ where } as any);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível resgatar registros de "${this.getModelLabel()}".`,
        ),
      );
    }

    return Result.ok<Model[]>(fetched.data);
  }

  async find(where?: object): Promise<Result<Model>> {
    const fetched = await (this.manager as any).find(where as any);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível resgatar registros de "${this.getModelLabel()}".`,
        ),
      );
    }

    return Result.ok<Model>(fetched.data[fetched.data.length - 1]);
  }

  async findOne(where?: object): Promise<Result<Model>> {
    const fetched = await (this.manager as any).findOne(where as any);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível resgatar registros de "${this.getModelLabel()}".`,
        ),
      );
    }

    return Result.ok<Model>(fetched.data[fetched.data.length - 1]);
  }


  async getById(id: string): Promise<Result<Model>> {
    const retrieved = await (this.manager as any).get(id);
    if (retrieved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<Model>(retrieved.data);
  }

  async get(where: object): Promise<Result<Model>> {
    const fetched = await (this.manager as any).getOne({ where } as any);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<Model>(fetched.data);
  }

  async create(data: CreateProps): Promise<Result<Model>> {
    const created = await (this.manager as any).createAndSave(data);

    if (created.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível criar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<Model>(created.data);
  }

  async update(data: DTO): Promise<Result<Model>> {
    const built = await (this.manager as any).build(data);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir "${this.getModelLabel()}"` +
          ' a partir dos dados informados.',
        ),
      );
    }

    const instance = built.data;
    const saved = await (this.manager as any).save(instance);

    if (saved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível salvar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<Model>(instance);
  }

  async remove(id: string): Promise<Result<boolean>> {
    const retrieved = await this.getById(id);

    if (retrieved.isFailure()) {
      return Result.fail(retrieved.error);
    }

    const instance = retrieved.data;

    const removed = await (this.manager as any).remove(instance);

    if (removed.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível remover "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<boolean>(true);
  }
}
