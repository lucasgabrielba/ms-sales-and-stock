import { AuditableDTO } from "../../../kernel/DTO/BaseDTO";
import { ProductDTO } from "./ProductDTO";

export interface ItemDTO extends AuditableDTO {
  id: string;
  quantity: number;
  product: ProductDTO
}