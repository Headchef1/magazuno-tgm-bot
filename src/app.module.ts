import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ShopsModule } from './shops/shops.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Время жизни окна в миллисекундах (1 минута)
        limit: 10, // Максимум 10 запросов за это время с одного IP
      },
    ]),
    ShopsModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 3. Подключение глобального гарда
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
