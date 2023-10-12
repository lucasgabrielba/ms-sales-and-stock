const { DataSource } = require('typeorm');
require('dotenv').config();

const connection = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/src/infra/database/entities/*{.ts,.js}'],
  synchronize: false,
  logging: false,
  migrations: ['src/infra/database/migrations/*.js'],
  cli: {
    migrationsDir: 'src/infra/database/migrations',
  },
});

module.exports = { connection };
