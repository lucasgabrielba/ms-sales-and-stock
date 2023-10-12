import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORMItem } from '../../../../infra/database/entities/ORMItem';

@Module({
  imports: [TypeOrmModule.forFeature([ORMItem])],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
