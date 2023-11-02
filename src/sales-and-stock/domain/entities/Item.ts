import { v4 } from 'uuid';
import * as Joi from 'joi';
import { Result } from '../../../../kernel/Result/Result';
import {
  Auditable,
  AuditableProps,
} from '../../../../kernel/domain/entity/Auditable';
import { ItemDTO } from '../../DTO/ItemDTO';
import { Product } from './Product';

export interface CreateItemPropsPrimitive {
  quantity: number;
  productId: string;
}

export interface UpdateItemPropsPrimitive {
  quantity?: number;
  productId: string;
  value: number;
}

export interface CreateItemProps {
  quantity: number;
  product: Product;
  value: number;
}

export interface ItemProps extends CreateItemProps, AuditableProps {}

export class Item extends Auditable {
  constructor(protected props: ItemProps) {
    super(props);
  }

  public static readonly LABEL: string = 'Item';

  get product(): Product {
    return this.props.product
  }
  get quantity(): number {
    return this.props.quantity
  }
  get value(): number {
    return this.props.quantity
  }

  static create(props: CreateItemProps): Result<Item> {
    const validated = Item.validate({
      id: v4(),

      product: props.product,
      quantity: props.quantity,
      value: props.value,

      createdAt: new Date(),
      updatedAt: undefined,
      deletedAt: undefined,
    });
    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok(new Item(validated.data));
  }

  static reconstitute(props: ItemDTO): Result<Item> {
    const validated = Item.validate({
      ...props,
      id: props.id ?? v4(),

      product: Product.reconstitute(props.product).data,
      quantity: props.quantity,
      value: props.value,

      createdAt: props.createdAt ? new Date(props.createdAt) : undefined,
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : undefined,
      deletedAt: props.deletedAt ? new Date(props.deletedAt) : undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok<Item>(new Item(validated.data));
  }

  static validate(data: ItemProps): Result<ItemProps> {
    const schema = {
      id: Joi.string().uuid().required(),

      product: Joi.object().instance(Product).required(),
      quantity: Joi.number().required(),
      value: Joi.number().required(),

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

  toDTO(): ItemDTO {
    return {
      id: this.id,

      product: this.product.toDTO(),
      quantity: this.quantity,
      value: this.value,

      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.props.deletedAt
        ? this.props.deletedAt.toISOString()
        : null,
    };
  }
}
