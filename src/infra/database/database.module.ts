import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ORMCustomer } from './entities/ORMCustomer';
import { ORMModule } from './entities/orm.module';
import { ORMAddress } from './entities/ORMAddress';
import { ORMItem } from './entities/ORMItem';
import { ORMProduct } from './entities/ORMProduct';
import { ORMSale } from './entities/ORMSale';

@Module({
  imports: [
    ORMModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          ORMCustomer,
          ORMAddress,
          ORMItem,
          ORMProduct,
          ORMSale
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  constructor(private connection: DataSource) {}
}
