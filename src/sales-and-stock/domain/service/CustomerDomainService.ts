import { Result } from '../../../../kernel/Result/Result';
import { AbstractDomainService } from '../../../../kernel/domain/domainService/AbstractDomainService';
import { CustomerDTO } from '../../DTO/CustomerDTO';
import { Customer, CreateCustomerProps } from '../entities/Customer';
import { CustomerRepositoryInterface } from '../repository/CustomerRepositoryInterface';

export class CustomerDomainService extends AbstractDomainService<
  Customer,
  CustomerDTO,
  CreateCustomerProps,
  CustomerRepositoryInterface
> {
  constructor(protected repository: CustomerRepositoryInterface) {
    super(repository);
  }

  async getOne(where: object): Promise<Result<Customer>> {
    const fetched = await this.repository.findOneEntity(where);

    if (fetched.isFailure()) {
      return Result.fail(fetched.error);
    }

    return Result.ok<Customer>(fetched.data);
  }

  async create(data: CreateCustomerProps): Promise<Result<Customer>> {
    const created = Customer.create(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Customer>(created.data);
  }

  async update(data: CustomerDTO): Promise<Result<Customer>> {
    const built = await this.build(data);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir ${Customer.LABEL} a partir dos dados informados.`,
        ),
      );
    }

    const instance = built.data;

    const saved = await this.save(instance);

    if (saved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível salvar ${Customer.LABEL}".`),
      );
    }

    return Result.ok<Customer>(instance);
  }

  async build(data: CustomerDTO): Promise<Result<Customer>> {
    const created = Customer.reconstitute(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Customer>(created.data);
  }
}
