import { Result } from '../../../../kernel/Result/Result';
import { AbstractApplicationService } from '../../../../kernel/application/service/AbstactApplicationService';
import { removeNulls } from '../../../../kernel/removeNulls/removeNullls';
import { AddressDTOPrimitive } from '../../DTO/AddressDTO';
import { AddressDomainService } from '../../domain/service/AddressDomainService';
import {
  Address,
  CreateAddressPropsPrimitive,
  UpdateAddressPropsPrimitive,
} from '../../domain/entities/Address';

export class AddressApplicationService extends AbstractApplicationService<
  Address,
  AddressDTOPrimitive,
  CreateAddressPropsPrimitive,
  AddressDomainService
> {
  constructor(readonly manager: AddressDomainService) {
    super(manager);
  }

  async create(data: CreateAddressPropsPrimitive): Promise<Result<Address>> {
    const result = await this.manager.createAndSave(data);

    if (result.isFailure()) {
      return Result.fail(result.error);
    }

    return result;
  }

  async updateEntity(
    id: string,
    data: UpdateAddressPropsPrimitive,
  ): Promise<Result<Address>> {
    removeNulls(data);

    const entity = await this.getById(id);

    if (entity.isFailure()) {
      return Result.fail(new Error('não foi possivel resgatar Address'));
    }

    const updateData = {
      ...entity.data.toDTO(),
      ...data,
    };

    const built = await this.manager.build(updateData);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir "${this.getModelLabel()}"` +
            ' a partir dos dados informados.',
        ),
      );
    }

    const instance = built.data;
    const saved = await this.manager.save(instance);

    if (saved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível salvar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok(instance);
  }

  async getById(id: string): Promise<Result<Address>> {
    const retrieved = await this.manager.get(id);
    if (retrieved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok(retrieved.data);
  }

  async get(where: object): Promise<Result<Address>> {
    const fetched = await this.manager.getOne(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<Address>(fetched.data);
  }

  async all(): Promise<Result<Address[]>> {
    const result = await this.manager.find();
    return result;
  }

  async filter(where: object): Promise<Result<Address[]>> {
    const fetched = await this.manager.filter(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível resgatar registros de "${this.getModelLabel()}".`,
        ),
      );
    }

    return Result.ok(fetched.data);
  }

  getModelLabel(): string {
    return Address.LABEL;
  }
}
