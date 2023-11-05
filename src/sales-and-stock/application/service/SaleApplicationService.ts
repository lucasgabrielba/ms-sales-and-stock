import { Result } from '../../../../kernel/Result/Result';
import { AbstractApplicationService } from '../../../../kernel/application/service/AbstactApplicationService';
import { removeNulls } from '../../../../kernel/removeNulls/removeNullls';
import {
  Sale
} from '../../domain/entities/Sale';
import { CreateSalePropsPrimitive, UpdateSalePropsPrimitive } from '../../domain/entities/Sale';
import { SaleDTO } from '../../DTO/SaleDTO';
import { Item } from '../../domain/entities/Item';
import { CustomerApplicationService } from './CustomerApplicationService';
import { ItemApplicationService } from './ItemApplicationService';
import { EStatusSale } from '../../domain/enum/EStatusSale';
import { SaleDomainService } from '../../domain/service/SaleDomainService';
import { MemberPayload } from '../../../web/sales-and-stock/utils/MemberPayload';
import { SearchBy } from '../../../web/sales-and-stock/utils/SearchBy';
import { ILike } from 'typeorm';

export class SaleApplicationService extends AbstractApplicationService<
  Sale,
  SaleDTO,
  CreateSalePropsPrimitive,
  SaleDomainService
> {
  constructor(
    readonly manager: SaleDomainService,
    private readonly customerAppService: CustomerApplicationService,
    private readonly itemAppService: ItemApplicationService,
  ) {
    super(manager);
  }

  async create(data: CreateSalePropsPrimitive): Promise<Result<Sale>> {
    let customer = await this.customerAppService.getById(data.customerId);
    if (customer.isFailure()) {
      customer = await this.customerAppService.create({
        companyId: data.companyId,
        name: data.customerName,
        cpfCnpj: data.customerCpfCnpj,
        email: data.customerEmail,
        whatsapp: data.customerWhatsapp,
        phone: data.customerPhone,
        address: {
          address: data.customerAddress,
          complement: data.customerComplement,
          number: data.customerNumber,
          district: data.customerDistrict,
          cep: data.customerCep,
          city: data.customerCity,
          state: data.customerState,
        }
      });

      if (customer.isFailure()) {
        return Result.fail(customer.error)
      }
    }

    let items: Item[] = [];
    for (const itemData of data.items) {
      const item = await this.itemAppService.create({
        quantity: itemData.quantity,
        productId: itemData.productId
      });

      if (item.isFailure()) {
        return Result.fail(item.error)
      }

      items.push(item.data)
    }

    delete data.items;

    const theLastCreatedSale = await this.find({
      where: { companyId: data.companyId }
    })
    console.log(theLastCreatedSale)
    const saleNumber = theLastCreatedSale?.data?.number ?
      theLastCreatedSale.data.number + 1 : 1

    const createData = {
      number: saleNumber,
      customer: customer.data,
      items: items,
      status: EStatusSale.ABERTO,
      history: [{
        history: 'Venda realizada',
        user: data.user,
        date: new Date().toISOString()
      }],
      companyId: data.companyId,
      value: data.value,
      isAcceptSuggestedValue: true,
      discount: data.discount,
      paid: data.paid,
    }

    const result = await this.manager.createAndSave(createData);
    if (result.isFailure()) {
      return Result.fail(result.error);
    }

    return result;
  }

  async updateEntity(
    id: string,
    data: UpdateSalePropsPrimitive,
    member: MemberPayload,
  ): Promise<Result<Sale>> {
    removeNulls(data);

    const entity = await this.getById(id);

    if (entity.isFailure()) {
      return Result.fail(new Error('não foi possivel resgatar Sale'));
    }

    let statusHistory;
    if (data.status) {
      statusHistory = {
        history: `O status da OS foi alterado para: ${data.status}`,
        user: member.username,
        date: new Date().toLocaleString("pt-BR"),
      }
    }

    if (data.history) {
      statusHistory = data.history
    }
    console.log(data)
    const updateData = {
      ...entity.data.toDTO(),
      status: data.status ? data.status : entity.data.status,
      paid: data.paid ? entity.data.paid + data.paid : entity.data.paid,
      history: [...entity.data.history, statusHistory],
    };

    removeNulls(updateData)

    const built = await this.manager.build(updateData);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir "${this.getModelLabel()}"` +
          ' a partir dos dados informados.',
        ),
      );
    }

    const instance = built.data;

    const saved = await this.manager.save(instance);

    if (saved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível salvar "${this.getModelLabel()}".`),
      );
    }


    return Result.ok(instance);

  }

  async getById(id: string): Promise<Result<Sale>> {
    const retrieved = await this.manager.get(id);
    if (retrieved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok(retrieved.data);
  }

  async search(data: SearchBy, member: MemberPayload): Promise<Result<Sale[]>> {
    let where: any = { where: { companyId: member.companyId } }

    if (data.number && data.number !== '') {
      where = {
        where: {
          number: data.number,
          companyId: member.companyId
        }
      }
    }

    if (data.cpfCnpj && data.cpfCnpj !== '') {
      where = {
        where: {
          customer: { cpfCnpj: ILike(`%${data.cpfCnpj}%`) },
          companyId: member.companyId
        }
      }
    }

    if (data.name && data.name !== '') {
      where = {
        where: {
          customer: { name: ILike(`%${data.name}%`) },
          companyId: member.companyId
        }
      }
    }

    if (data.phone && data.phone !== '') {
      where = {
        where: {
          customer: { phone: ILike(`%${data.phone}%`) },
          companyId: member.companyId
        }
      }
    }

    const result = await this.manager.filter({
      ...where
    });

    if (result.isFailure()) {
      return Result.fail(result.error);
    }

    return Result.ok(result.data);
  }

  async get(where: object): Promise<Result<Sale>> {
    const fetched = await this.manager.getOne(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<Sale>(fetched.data);
  }

  async all(member: MemberPayload): Promise<Result<Sale[]>> {
    const result = await this.manager.find({ where: { companyId: member.companyId } });
    return result;
  }

  async filter(where: object): Promise<Result<Sale[]>> {
    const fetched = await this.manager.filter(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível resgatar registros de "${this.getModelLabel()}".`,
        ),
      );
    }

    return Result.ok(fetched.data);
  }

  async getByNumber(number: string, member: MemberPayload): Promise<Result<Sale>> {
    const result = await this.manager.getOne({
      where: { number: number, companyId: member.companyId }
    })
    if (result.isFailure()) {
      return Result.fail(result.error)
    }

    return result
  }

  getModelLabel(): string {
    return Sale.LABEL;
  }
}
