// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Безопасность заголовков
  app.use(helmet());

  // 2. CORS (для Frontend)
  app.enableCors({
    origin: ['http://localhost:5173', 'https://your-frontend-domain.com'], // Укажите ваши домены
    credentials: true,
  });

  // 3. Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет поля, которых нет в DTO
      forbidNonWhitelisted: true, // Выбрасывает ошибку, если есть лишние поля
      transform: true, // Авто-преобразование типов (например, string -> number в params)
    }),
  );

  // Префикс для всех роутов
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
