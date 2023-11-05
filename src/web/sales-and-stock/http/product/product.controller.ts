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
import { ProductDTO } from '../../../../sales-and-stock/DTO/ProductDTO';
import { CreateProductPropsPrimitive, UpdateProductPropsPrimitive } from '../../../../sales-and-stock/domain/entities/Product';
import { ProductService } from './product.service';
import { SearchProductBy } from '../../utils/SearchProductBy';

@Controller('product')
@UseGuards(AuthGuard('jwt'))
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  async findAll(@Res() res: Response, @Req() req: any): Promise<ProductDTO[]> {
    const result = await this.service.listAllProduct(req.user);

    if (result.isFailure()) {
      res.status(400).json({ error: result.error.message });
      return;
    }

    const allEntities: ProductDTO[] = [];
    for (const product of result.data) {
      if (product) {
        allEntities.push(product.toDTO());
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
  ): Promise<ProductDTO> {
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
  //   @Body() data: FindProductBy,
  //   @Res() res: Response,
  //   @Req() req: any,
  // ): Promise<ProductDTO[]> {
  //   const result = await this.service.findBy(data, req.user);

  //   if (result.isFailure()) {
  //     res.status(400).json({ error: result.error.message });
  //     return;
  //   }
  //   res.status(200).send(result.data.map((product) => product.toDTO()));
  //   return;
  // }

  @Post()
  async create(
    @Body() data: CreateProductPropsPrimitive,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<ProductDTO> {
    const result = await this.service.create(data, req.user);
    if (result.isFailure()) {
      res.status(400).json({ error: result.error.message });
      return;
    }
    res.status(200).send(result.data.toDTO());
    return;
  }

  @Post('/search')
  async search(
    @Body() data: SearchProductBy,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<ProductDTO> {
    const result = await this.service.search(data, req.user);

    if (result.isFailure()) {
      res.status(400).json({ error: result.error.message });
      return;
    }

    res.status(200).send(result.data.map((i) => i.toDTO()));
    return;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProductPropsPrimitive,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<ProductDTO> {
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
