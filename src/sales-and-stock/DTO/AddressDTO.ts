import { AuditableDTO } from '../../../kernel/DTO/BaseDTO';

export interface AddressDTO extends AuditableDTO {
  id: string;
  address?: string;
  complement?: string;
  number?: string;
  district?: string;
  cep?: string;
  city?: string;
  state?: string;
}

export interface AddressDTOPrimitive extends AddressDTO {
}
