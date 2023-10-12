import { v4 } from 'uuid';
import * as Joi from 'joi';
import { Result } from '../../../../kernel/Result/Result';
import { CustomerDTO } from '../../DTO/CustomerDTO';
import {
  Auditable,
  AuditableProps,
} from '../../../../kernel/domain/entity/Auditable';
import { Address, CreateAddressPropsPrimitive, UpdateAddressPropsPrimitive } from './Address';

export interface CreateCustomerPropsPrimitive {
  name: string;
  cpfCnpj: string;
  email: string;
  whatsapp: string;
  phone: string;
  address?: CreateAddressPropsPrimitive;
  companyId: string;
}

export interface UpdateCustomerPropsPrimitive {
  name: string;
  cpfCnpj: string;
  email: string;
  whatsapp: string;
  phone: string;
  address?: UpdateAddressPropsPrimitive;
  companyId: string;
}

export interface CreateCustomerProps {
  name: string;
  email: string;
  cpfCnpj?: string;
  whatsapp: string;
  phone: string;
  address?: Address;
  companyId: string;
}

export interface CustomerProps extends CreateCustomerProps, AuditableProps {}

export class Customer extends Auditable {
  constructor(protected props: CustomerProps) {
    super(props);
  }

  public static readonly LABEL: string = 'Customer';

  get companyId(): string {
    return this.props.companyId
  }
  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get cpfCnpj(): string {
    return this.props.cpfCnpj
  }

  get phone(): string {
    return this.props.phone
  }

  get whatsapp(): string {
    return this.props.whatsapp
  }

  get address(): Address {
    return this.props.address
  }

  static create(props: CreateCustomerProps): Result<Customer> {
    const validated = Customer.validate({
      id: v4(),

      name: props.name,
      cpfCnpj: props.cpfCnpj,
      email: props.email,
      whatsapp: props.whatsapp,
      companyId: props.companyId,
      phone: props.phone,
      address: props.address ?? undefined,

      createdAt: new Date(),
      updatedAt: undefined,
      deletedAt: undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok(new Customer(validated.data));
  }

  static reconstitute(props: CustomerDTO): Result<Customer> {
    const validated = Customer.validate({
      ...props,
      id: props.id ?? v4(),
      name: props.name,
      cpfCnpj: props.cpfCnpj,
      email: props.email,
      whatsapp: props.whatsapp,
      companyId: props.companyId,
      phone: props.phone,
      address: Address.reconstitute(props.address).data,

      createdAt: props.createdAt ? new Date(props.createdAt) : undefined,
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : undefined,
      deletedAt: props.deletedAt ? new Date(props.deletedAt) : undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok<Customer>(new Customer(validated.data));
  }

  static validate(data: CustomerProps): Result<CustomerProps> {
    const schema = {
      id: Joi.string().uuid().required(),
      name: Joi.string().min(1).max(255).required(),
      cpfCnpj: Joi.string().max(255).optional().allow("", null),
      email: Joi.string().email().max(255).optional().allow(""),
      whatsapp: Joi.string().max(255).optional().allow(""),
      phone: Joi.string().max(255).optional().allow(""),
      address: Joi.object().instance(Address).optional(),

      createdAt: Joi.object().instance(Date).required(),
      updatedAt: Joi.object().instance(Date).optional(),
      deletedAt: Joi.object().instance(Date).optional(),
    };

    const { value, error } = Joi.object(schema).unknown().validate(data);

    if (error) {
      return Result.fail(error);
    }

    return Result.ok(value);
  }

  toDTO(): CustomerDTO {
    return {
      id: this.id,

      name: this.name,
      cpfCnpj: this.cpfCnpj ?? null,
      email: this.email,
      whatsapp: this.whatsapp,
      phone: this.phone,
      address: this.address.toDTO(),
      companyId: this.companyId,


      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.props.deletedAt
        ? this.props.deletedAt.toISOString()
        : null,
    };
  }
}
