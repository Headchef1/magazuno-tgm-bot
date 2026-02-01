import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем CORS, чтобы фронтенд мог слать запросы
  app.enableCors({
    origin: '*', // Для разработки можно '*', для продакшена лучше указать домен
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Запуск на порту 3000 (в Dockerfile мы его открыли)
  await app.listen(3000);
  console.log('Application is running on port 3000');
}
bootstrap();
