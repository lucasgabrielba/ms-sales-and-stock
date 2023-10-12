import { AuditableDTO } from "../../../kernel/DTO/BaseDTO";
import { AddressDTO } from "./AddressDTO";

export interface CustomerDTO extends AuditableDTO {
  id: string;
  name: string;
  cpfCnpj?: string;
  email?: string;
  whatsapp?: string;
  phone?: string;
  companyId?: string;
  address?: AddressDTO;
}

export interface CustomerDTOPrimitive extends CustomerDTO {}
