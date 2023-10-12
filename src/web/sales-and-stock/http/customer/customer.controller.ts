import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CustomerService } from './customer.service';
import { CustomerDTO } from '../../../../sales-and-stock/DTO/CustomerDTO';
import {
  CreateCustomerPropsPrimitive,
  UpdateCustomerPropsPrimitive,
} from '../../../../sales-and-stock/domain/entities/Customer';
import { FindCustomerBy } from '../../../../sales-and-stock/filters/FindCustomerBy';

@Controller('customer')
@UseGuards(AuthGuard('jwt'))
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get()
  async findAll(@Res() res: Response, @Req() req: any): Promise<CustomerDTO[]> {
    const result = await this.service.listAllCustomer(req.user.type);

    if (result.isFailure()) {
      res.status(400).json({ error: result.error.message });
      return;
    }

    const allEntities: CustomerDTO[] = [];
    for (const customer of result.data) {
      if (customer) {
        allEntities.push(customer.toDTO());
      }
    }

    res.status(200).send(allEntities);

    return;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<CustomerDTO> {
    const result = await this.service.findOne(id, req.user.type);

    if (result.isFailure()) {
      res.status(400).json({ error: result.error.message });
      return;
    }

    res.status(200).send(result.data.toDTO());
    return;
  }

  @Post('/findby')
  async findBy(
    @Body() data: FindCustomerBy,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<CustomerDTO[]> {
    const result = await this.service.findBy(data, req.user);

    if (result.isFailure()) {
      res.status(400).json({ error: result.error.message });
      return;
    }
    res.status(200).send(result.data.map((customer) => customer.toDTO()));
    return;
  }

  @Post()
  async create(
    @Body() data: CreateCustomerPropsPrimitive,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<CustomerDTO> {
    const result = await this.service.create(data, req.user.type);

    if (result.isFailure()) {
      res.status(400).json({ error: result.error.message });
      return;
    }
    res.status(200).send(result.data.toDTO());
    return;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCustomerPropsPrimitive,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<CustomerDTO> {
    const result = await this.service.update(id, data, req.user.type);

    if (result.isFailure()) {
      res.status(400).json({ error: result.error.message });
      return;
    }

    res.status(200).send(result.data.toDTO());
    return;
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<boolean> {
    const result = await this.service.delete(id, req.user.type);

    if (result.isFailure()) {
      res.status(400).json({ error: result.error.message });
      return;
    }

    res.status(200).send(result.data);
    return;
  }
}
