import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina campos no declarados en el DTO
    forbidNonWhitelisted: true, // Lanza error si se envían campos no permitidos
    transform: true, // Transforma los datos al tipo esperado en el DTO
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
