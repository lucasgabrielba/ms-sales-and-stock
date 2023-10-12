import { Result } from '../../../../kernel/Result/Result';
import { AbstractDomainService } from '../../../../kernel/domain/domainService/AbstractDomainService';
import { SaleDTO } from '../../DTO/SaleDTO';
import { CreateSaleProps, Sale } from '../entities/Sale';
import { SaleRepositoryInterface } from '../repository/SaleRepositoryInterface';

export class SaleDomainService extends AbstractDomainService<
  Sale,
  SaleDTO,
  CreateSaleProps,
  SaleRepositoryInterface
> {
  constructor(protected repository: SaleRepositoryInterface) {
    super(repository);
  }

  async create(data: CreateSaleProps): Promise<Result<Sale>> {
    const created = Sale.create(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Sale>(created.data);
  }

  async find(): Promise<Result<Sale[]>> {
    const fetched = await this.repository.findEntity();

    if (fetched.isFailure()) {
      return Result.fail(fetched.error);
    }

    return Result.ok(fetched.data);
  }


  async update(data: SaleDTO): Promise<Result<Sale>> {
    const built = await this.build(data);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir ${Sale.LABEL} a partir dos dados informados.`,
        ),
      );
    }

    const instance = built.data;
    const saved = await this.save(instance);

    if (saved.isFailure()) {
      return Result.fail(new Error(`Não foi possível salvar ${Sale.LABEL}".`));
    }

    return Result.ok<Sale>(instance);
  }

  async build(data: SaleDTO): Promise<Result<Sale>> {
    const created = Sale.reconstitute(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Sale>(created.data);
  }
}
