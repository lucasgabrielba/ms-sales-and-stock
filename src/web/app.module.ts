import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../infra/database/database.module';
import { EntrypointModule } from './sales-and-stock/entrypoint/entrypoint.module';
import { RepositoryModule } from '../infra/database/repositories/repository.module';
import { ORMModule } from '../infra/database/entities/orm.module';
import { MSSalesAndStockModule } from './sales-and-stock/msSalesAndStock.module';

@Module({
  imports: [
    ORMModule,
    ConfigModule.forRoot(),
    ConfigModule,
    DatabaseModule,
    MSSalesAndStockModule,
    EntrypointModule,
    RepositoryModule,
  ],
})
export class AppModule {}
