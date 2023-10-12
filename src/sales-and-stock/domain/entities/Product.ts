import { v4 } from 'uuid';
import * as Joi from 'joi';
import { Result } from '../../../../kernel/Result/Result';
import {
  Auditable,
  AuditableProps,
} from '../../../../kernel/domain/entity/Auditable';
import { ProductDTO } from '../../DTO/ProductDTO';

export interface CreateProductPropsPrimitive {
  companyId: string;
  quantity: number;
  name: string;
  productCode?: string;
  type?: string;
  brand?: string;
  model?: string;
  salePrice?: number;
  costPrice?: number;
  supplier?: string;
}

export interface UpdateProductPropsPrimitive {
  companyId: string;
  quantity: number;
  name?: string;
  productCode?: string;
  type?: string;
  brand?: string;
  model?: string;
  salePrice?: number;
  costPrice?: number;
  supplier?: string;
}

export interface CreateProductProps {
  companyId: string;
  quantity: number;
  name?: string;
  productCode?: string;
  type?: string;
  brand?: string;
  model?: string;
  salePrice?: number;
  costPrice?: number;
  supplier?: string;
}

export interface ProductProps extends CreateProductProps, AuditableProps {}

export class Product extends Auditable {
  constructor(protected props: ProductProps) {
    super(props);
  }

  public static readonly LABEL: string = 'Product';

  get companyId(): string {
    return this.props.companyId
  }
  get quantity(): number {
    return this.props.quantity
  }
  get name(): string {
    return this.props.name
  }
  get productCode(): string {
    return this.props.productCode
  }
  get type(): string {
    return this.props.type
  }
  get brand(): string {
    return this.props.brand
  }
  get model(): string {
    return this.props.model
  }
  get salePrice(): number {
    return this.props.salePrice
  }
  get costPrice(): number {
    return this.props.costPrice
  }
  get supplier(): string {
    return this.props.supplier
  }

  static create(props: CreateProductProps): Result<Product> {
    const validated = Product.validate({
      id: v4(),

      companyId: props.companyId,
      quantity: props.quantity,
      name: props.name,
      productCode: props.productCode,
      type: props.type,
      brand: props.brand,
      model: props.model,
      salePrice: props.salePrice,
      costPrice: props.costPrice,
      supplier: props.supplier,

      createdAt: new Date(),
      updatedAt: undefined,
      deletedAt: undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok(new Product(validated.data));
  }

  static reconstitute(props: ProductDTO): Result<Product> {
    const validated = Product.validate({
      ...props,
      id: props.id ?? v4(),

      companyId: props.companyId,
      quantity: props.quantity,
      name: props.name,
      productCode: props.productCode,
      type: props.type,
      brand: props.brand,
      model: props.model,
      salePrice: props.salePrice,
      costPrice: props.costPrice,
      supplier: props.supplier,

      createdAt: props.createdAt ? new Date(props.createdAt) : undefined,
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : undefined,
      deletedAt: props.deletedAt ? new Date(props.deletedAt) : undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok<Product>(new Product(validated.data));
  }

  static validate(data: ProductProps): Result<ProductProps> {
    const schema = {
      id: Joi.string().uuid().required(),
      companyId: Joi.string().required(),
      quantity: Joi.number().required(),
      name: Joi.string().required(),
      productCode: Joi.string().optional().allow(null, ""),
      type: Joi.string().optional().allow(null, ""),
      brand: Joi.string().optional().allow(null, ""),
      model: Joi.string().optional().allow(null, ""),
      salePrice: Joi.number().optional().allow(null, ""),
      costPrice: Joi.number().optional().allow(null, ""),
      supplier: Joi.string().optional().allow(null, ""),

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

  toDTO(): ProductDTO {
    return {
      id: this.id,

      companyId: this.companyId,
      quantity: this.quantity,
      name: this.name,
      productCode: this.productCode,
      type: this.type,
      brand: this.brand,
      model: this.model,
      salePrice: this.salePrice,
      costPrice: this.costPrice,
      supplier: this.supplier,

      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.props.deletedAt
        ? this.props.deletedAt.toISOString()
        : null,
    };
  }
}
