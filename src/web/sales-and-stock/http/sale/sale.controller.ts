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
import { SaleDTO } from '../../../../sales-and-stock/DTO/SaleDTO';
import {
  CreateSalePropsPrimitive,
  UpdateSalePropsPrimitive,
} from '../../../../sales-and-stock/domain/entities/Sale';
import { SaleService } from './sale.service';

@Controller('sale')
@UseGuards(AuthGuard('jwt'))
export class SaleController {
  constructor(private readonly service: SaleService) {}

  @Get()
  async findAll(@Res() res: Response, @Req() req: any): Promise<SaleDTO[]> {
    const result = await this.service.listAllSale(req.user.type);

    if (result.isFailure()) {
      res.status(400).json({ error: result.error.message });
      return;
    }

    const allEntities: SaleDTO[] = [];
    for (const sale of result.data) {
      if (sale) {
        allEntities.push(sale.toDTO());
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
  ): Promise<SaleDTO> {
    const result = await this.service.findOne(id, req.user.type);

    if (result.isFailure()) {
      res.status(400).json({ error: result.error.message });
      return;
    }

    res.status(200).send(result.data.toDTO());
    return;
  }

  // @Post('/findby')
  // async findBy(
  //   @Body() data: FindSaleBy,
  //   @Res() res: Response,
  //   @Req() req: any,
  // ): Promise<SaleDTO[]> {
  //   const result = await this.service.findBy(data, req.user);

  //   if (result.isFailure()) {
  //     res.status(400).json({ error: result.error.message });
  //     return;
  //   }
  //   res.status(200).send(result.data.map((sale) => sale.toDTO()));
  //   return;
  // }

  @Post()
  async create(
    @Body() data: CreateSalePropsPrimitive,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<SaleDTO> {
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
    @Body() data: UpdateSalePropsPrimitive,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<SaleDTO> {
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
