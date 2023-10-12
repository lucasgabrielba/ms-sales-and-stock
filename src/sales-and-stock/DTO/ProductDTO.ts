import { AuditableDTO } from "../../../kernel/DTO/BaseDTO";

export interface ProductDTO extends AuditableDTO {
  id: string;
  companyId: string;
  quantity: number;
  name: string;
  productCode: string;
  type: string;
  brand: string;
  model: string;
  salePrice: number;
  costPrice: number;
  supplier: string;
}