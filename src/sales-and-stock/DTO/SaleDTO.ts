import { EStatusSale } from "../domain/enum/EStatusSale"
import { CustomerDTO } from "./CustomerDTO"
import { AuditableDTO } from "../../../kernel/DTO/BaseDTO"
import { History } from "../domain/interfaces/History"
import { ItemDTO } from "./ItemDTO"

export interface SaleDTO extends AuditableDTO {
  id: string
  companyId: string
  customer: CustomerDTO
  items: ItemDTO[]
  value: number
  isAcceptSuggestedValue: boolean
  discount: number
  status: EStatusSale
  paid: number
  history: History[]
  number: number
}
