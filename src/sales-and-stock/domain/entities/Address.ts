import { v4 } from 'uuid';
import * as Joi from 'joi';
import { Auditable, AuditableProps } from '../../../../kernel/domain/entity/Auditable';
import { Result } from '../../../../kernel/Result/Result';
import { AddressDTO } from '../../DTO/AddressDTO';


export interface CreateAddressPropsPrimitive {
  address?: string;
  complement?: string;
  number?: string;
  district?: string;
  cep?: string;
  city?: string;
  state?: string;
}

export interface UpdateAddressPropsPrimitive {
  id?: string
  address?: string;
  complement?: string;
  number?: string;
  district?: string;
  cep?: string;
  city?: string;
  state?: string;
}

export interface CreateAddressProps {
  address?: string;
  complement?: string;
  number?: string;
  district?: string;
  cep?: string;
  city?: string;
  state?: string;
}

export interface AddressProps extends CreateAddressProps, AuditableProps {}

export class Address extends Auditable {
  constructor(protected props: AddressProps) {
    super(props);
  }

  public static readonly LABEL: string = 'Address';

  get address(): string {
    return this.props.address
  }
  get complement(): string {
    return this.props.complement
  }
  get number(): string {
    return this.props.number
  }
  get district(): string {
    return this.props.district
  }
  get cep(): string {
    return this.props.cep
  }
  get city(): string {
    return this.props.city
  }
  get state(): string {
    return this.props.state
  }

  static create(props: CreateAddressProps): Result<Address> {
    const validated = Address.validate({
      id: v4(),

      address: props.address ?? undefined,
      complement: props.complement ?? undefined,
      number: props.number ?? undefined,
      district: props.district ?? undefined,
      cep: props.cep ?? undefined,
      city: props.city ?? undefined,
      state: props.state ?? undefined,

      createdAt: new Date(),
      updatedAt: undefined,
      deletedAt: undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok(new Address(validated.data));
  }

  static reconstitute(props: AddressDTO): Result<Address> {
    const validated = Address.validate({
      ...props,
      id: props.id ?? v4(),

      address: props.address ?? undefined,
      complement: props.complement ?? undefined,
      number: props.number ?? undefined,
      district: props.district ?? undefined,
      cep: props.cep ?? undefined,
      city: props.city ?? undefined,
      state: props.state ?? undefined,

      createdAt: props.createdAt ? new Date(props.createdAt) : undefined,
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : undefined,
      deletedAt: props.deletedAt ? new Date(props.deletedAt) : undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok<Address>(new Address(validated.data));
  }

  static validate(data: AddressProps): Result<AddressProps> {
    const schema = {
      id: Joi.string().uuid().required(),

      address: Joi.string().max(255).optional().allow(null, ''),
      complement: Joi.string().max(255).optional().allow(null, ''),
      number: Joi.string().optional().allow(null, ''),
      district: Joi.string().max(255).optional().allow(null, ''),
      cep: Joi.string().min(5).max(255).optional().allow(null, ''),
      city: Joi.string().min(1).max(255).optional().allow(null, ''),
      state: Joi.string().min(2).max(2).optional().allow(null, ''),

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

  toDTO(): AddressDTO {
    return {
      id: this.id,

      address: this.address,
      complement: this.complement,
      number: this.number,
      district: this.district,
      cep: this.cep,
      city: this.city,
      state: this.state,

      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.props.deletedAt
        ? this.props.deletedAt.toISOString()
        : null,
    };
  }
}
