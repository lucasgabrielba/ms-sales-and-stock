import { Result } from '../../../../kernel/Result/Result';
import { AbstractDomainService } from '../../../../kernel/domain/domainService/AbstractDomainService';
import { AddressDTO } from '../../DTO/AddressDTO';
import { CreateAddressProps, Address } from '../entities/Address';
import { AddressRepositoryInterface } from '../repository/AddressRepositoryInterface';

export class AddressDomainService extends AbstractDomainService<
  Address,
  AddressDTO,
  CreateAddressProps,
  AddressRepositoryInterface
> {
  constructor(protected repository: AddressRepositoryInterface) {
    super(repository);
  }

  async create(data: CreateAddressProps): Promise<Result<Address>> {
    const created = Address.create(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Address>(created.data);
  }

  async find(): Promise<Result<Address[]>> {
    const fetched = await this.repository.findEntity();

    if (fetched.isFailure()) {
      return Result.fail(fetched.error);
    }

    return Result.ok(fetched.data);
  }


  async update(data: AddressDTO): Promise<Result<Address>> {
    const built = await this.build(data);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir ${Address.LABEL} a partir dos dados informados.`,
        ),
      );
    }

    const instance = built.data;
    const saved = await this.save(instance);

    if (saved.isFailure()) {
      return Result.fail(new Error(`Não foi possível salvar ${Address.LABEL}".`));
    }

    return Result.ok<Address>(instance);
  }

  async build(data: AddressDTO): Promise<Result<Address>> {
    const created = Address.reconstitute(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Address>(created.data);
  }
}
