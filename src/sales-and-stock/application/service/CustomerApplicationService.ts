import { ILike } from 'typeorm';
import { Result } from '../../../../kernel/Result/Result';
import { AbstractApplicationService } from '../../../../kernel/application/service/AbstactApplicationService';
import { removeNulls } from '../../../../kernel/removeNulls/removeNullls';
import { CustomerDTOPrimitive } from '../../DTO/CustomerDTO';
import { CustomerDomainService } from '../../domain/service/CustomerDomainService';
import { Address } from '../../domain/entities/Address';
import {
  Customer,
  CreateCustomerPropsPrimitive,
  UpdateCustomerPropsPrimitive,
} from '../../domain/entities/Customer';
import { FindCustomerBy } from '../../filters/FindCustomerBy';
import { AddressApplicationService } from './AddressApplicationService';
import { MemberPayload } from '../../../web/sales-and-stock/utils/MemberPayload';

export class CustomerApplicationService extends AbstractApplicationService<
  Customer,
  CustomerDTOPrimitive,
  CreateCustomerPropsPrimitive,
  CustomerDomainService
> {
  constructor(
    readonly manager: CustomerDomainService,
    protected readonly addressAppService: AddressApplicationService,
  ) {
    super(manager);
  }

  async create(data: CreateCustomerPropsPrimitive): Promise<Result<Customer>> {
    if (data.cpfCnpj) {
      let CustomerExist = await this.get({ cpfCnpj: data.cpfCnpj });

      if (CustomerExist.isSuccess()) {
        return Result.fail(
          new Error(`Já existe usuário criado com esse cpf/cnpj.`),
        );
      }
    }

    const address = await this.addressAppService.create({
      address: data.address.address,
      complement: data.address.complement,
      number: data.address.number,
      district: data.address.district,
      cep: data.address.cep,
      city: data.address.city,
      state: data.address.state,
    });

    const createData = {
      ...data,
      address: address.data,
    };

    const result = await this.manager.createAndSave(createData);
    if (result.isFailure()) {
      return Result.fail(result.error);
    }

    return result;
  }

  async updateEntity(
    id: string,
    data: UpdateCustomerPropsPrimitive,
  ): Promise<Result<Customer>> {
    removeNulls(data);
    removeNulls(data.address);

    const entity = await this.getById(id);

    if (entity.isFailure()) {
      return Result.fail(new Error('não foi possivel resgatar Customer'));
    }

    if (
      Object.keys(data).length === 1 &&
      Object.keys(data)[0] === 'address' &&
      Object.keys(data.address).length === 0
    ) {
      return entity;
    }

    let address: Result<Address> | undefined;

    if (data.address) {
      address = await this.addressAppService.updateEntity(
        data.address.id,
        data.address,
      );
      if (address.isFailure()) {
        return Result.fail(address.error);
      }
    }

    const updateData = {
      ...entity.data.toDTO(),
      ...data,
      address: address ? address.data.toDTO() : entity.data.address.toDTO(),
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

  async getById(id: string): Promise<Result<Customer>> {
    const retrieved = await this.manager.get(id);
    if (retrieved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok(retrieved.data);
  }

  async findBy(
    data: FindCustomerBy,
    member: MemberPayload,
  ): Promise<Result<Customer[]>> {
    let where: any = { where: { companyId: member.companyId } };

    if (data.cpfCnpj && data.cpfCnpj !== '') {
      where = {
        where: {
          cpfCnpj: ILike(`%${data.cpfCnpj}%`),
          companyId: member.companyId,
        },
      };
    }

    if (data.name && data.name !== '') {
      where = {
        where: {
          name: ILike(`%${data.name}%`),
          companyId: member.companyId,
        },
      };
    }

    if (data.phone && data.phone !== '') {
      where = {
        where: {
          phone: ILike(`%${data.phone}%`),
          companyId: member.companyId,
        },
      };
    }

    const result = await this.manager.filter({
      ...where,
    });

    if (result.isFailure()) {
      return Result.fail(result.error);
    }

    return Result.ok(result.data);
  }

  async get(where: object): Promise<Result<Customer>> {
    const fetched = await this.manager.getOne(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }
    return fetched;
  }

  async all(): Promise<Result<Customer[]>> {
    const result = await this.manager.find();
    return result;
  }

  async filter(where: object): Promise<Result<Customer[]>> {
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

  async remove(id: string): Promise<Result<boolean>> {
    const retrieved = await this.getById(id);

    if (retrieved.isFailure()) {
      return Result.fail(retrieved.error);
    }

    const removeAddress = await this.addressAppService.remove(retrieved.data.address.id)

    if (removeAddress.isFailure()) {
      return Result.fail(removeAddress.error)
    }

    const instance = retrieved.data;

    const removed = await this.manager.remove(instance);

    if (removed.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível remover "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<boolean>(true);
  }

  getModelLabel(): string {
    return Customer.LABEL;
  }
}
