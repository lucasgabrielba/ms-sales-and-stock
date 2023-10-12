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
import { ItemService } from './item.service';
import { ItemDTO } from '../../../../sales-and-stock/DTO/ItemDTO';
import { CreateItemPropsPrimitive, UpdateItemPropsPrimitive } from '../../../../sales-and-stock/domain/entities/Item';

@Controller('item')
@UseGuards(AuthGuard('jwt'))
export class ItemController {
  constructor(private readonly service: ItemService) {}

  @Get()
  async findAll(@Res() res: Response, @Req() req: any): Promise<ItemDTO[]> {
    const result = await this.service.listAllItem(req.user.type);

    if (result.isFailure()) {
      res.status(400).json({ error: result.error.message });
      return;
    }

    const allEntities: ItemDTO[] = [];
    for (const item of result.data) {
      if (item) {
        allEntities.push(item.toDTO());
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
  ): Promise<ItemDTO> {
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
  //   @Body() data: FindItemBy,
  //   @Res() res: Response,
  //   @Req() req: any,
  // ): Promise<ItemDTO[]> {
  //   const result = await this.service.findBy(data, req.user);

  //   if (result.isFailure()) {
  //     res.status(400).json({ error: result.error.message });
  //     return;
  //   }
  //   res.status(200).send(result.data.map((item) => item.toDTO()));
  //   return;
  // }

  @Post()
  async create(
    @Body() data: CreateItemPropsPrimitive,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<ItemDTO> {
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
    @Body() data: UpdateItemPropsPrimitive,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<ItemDTO> {
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
