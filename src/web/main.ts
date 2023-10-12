import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:4090', 'http://localhost:3000']
  });

  await app.listen(process.env.PORT);
  console.log(`http://localhost:${process.env.PORT}`)
  console.log(`MS Sales and Stock`)
}
bootstrap();
