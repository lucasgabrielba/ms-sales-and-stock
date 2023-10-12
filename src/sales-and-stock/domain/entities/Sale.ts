import { v4 } from 'uuid';
import * as Joi from 'joi';
import { Result } from '../../../../kernel/Result/Result';
import { SaleDTO } from '../../DTO/SaleDTO';
import {
  Auditable,
  AuditableProps,
} from '../../../../kernel/domain/entity/Auditable';
import { EStatusSale } from '../enum/EStatusSale';
import { Customer } from './Customer';
import { History } from '../interfaces/History';
import { Item } from './Item';

export interface CreateSalePropsPrimitive {
  companyId: string
  customerId: string
  itemsId: string[]
  value: number
  isAcceptSuggestedValue: boolean
  discount: number
  status: EStatusSale
  paid: number
  history: History[]
}

export interface UpdateSalePropsPrimitive extends Partial<CreateSalePropsPrimitive> {}

export interface CreateSaleProps {
  companyId: string
  customer: Customer
  items: Item[]
  value: number
  isAcceptSuggestedValue: boolean
  discount: number
  status: EStatusSale
  paid: number
  history: History[]
}

export interface SaleProps extends CreateSaleProps, AuditableProps {}

export class Sale extends Auditable {
  constructor(protected props: SaleProps) {
    super(props);
  }

  public static readonly LABEL: string = 'Sale';

  get companyId(): string {
    return this.props.companyId
  }
  get customer(): Customer {
    return this.props.customer
  }
  get items(): Item[] {
    return this.props.items
  }
  get value(): number {
    return this.props.value
  }
  get isAcceptSuggestedValue(): boolean {
    return this.props.isAcceptSuggestedValue
  }
  get discount(): number {
    return this.props.discount
  }
  get status(): EStatusSale {
    return this.props.status
  }
  get paid(): number {
    return this.props.paid
  }
  get history(): History[] {
    return this.props.history;
  }

  static create(props: CreateSaleProps): Result<Sale> {
    const validated = Sale.validate({
      id: v4(),

      companyId: props.companyId,
      customer: props.customer,
      items: props.items,
      value: props.value,
      isAcceptSuggestedValue: props.isAcceptSuggestedValue,
      discount: props.discount,
      status: props.status,
      paid: props.paid,
      history: props.history,

      createdAt: new Date(),
      updatedAt: undefined,
      deletedAt: undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok(new Sale(validated.data));
  }

  static reconstitute(props: SaleDTO): Result<Sale> {
    const validated = Sale.validate({
      ...props,
      id: props.id ?? v4(),

      companyId: props.companyId,
      customer: Customer.reconstitute(props.customer).data,
      items: props.items.map(i => Item.reconstitute(i).data),
      value: props.value,
      isAcceptSuggestedValue: props.isAcceptSuggestedValue,
      discount: props.discount,
      status: props.status,
      paid: props.paid,
      history: props.history,

      createdAt: props.createdAt ? new Date(props.createdAt) : undefined,
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : undefined,
      deletedAt: props.deletedAt ? new Date(props.deletedAt) : undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok<Sale>(new Sale(validated.data));
  }

  static validate(data: SaleProps): Result<SaleProps> {
    const schema = {
      id: Joi.string().uuid().required(),

      companyId: Joi.string().uuid().required(),
      customer: Joi.object().instance(Customer).required(),
      items: Joi.array().required(),
      value: Joi.number().required(),
      history: Joi.array().optional(),
      isAcceptSuggestedValue: Joi.boolean().required(),
      discount: Joi.number().optional(),
      status: Joi.string().required(),
      paid: Joi.number().required(),

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

  toDTO(): SaleDTO {
    return {
      id: this.id,

      companyId: this.companyId,
      customer: this.customer.toDTO(),
      items: this.items.map(i => i.toDTO()),
      value: this.value,
      isAcceptSuggestedValue: this.isAcceptSuggestedValue,
      discount: this.discount,
      status: this.status,
      paid: this.paid,
      history: this.history,

      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.props.deletedAt
        ? this.props.deletedAt.toISOString()
        : null,
    };
  }
}
