import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHello(): string {
    return 'Hello from Magazuno Backend (Db Connected)!';
  }

  // Создать юзера (Тест)
  @Post('users/test')
  async createTestUser(
    @Body() body: { telegram_id: string; username: string },
  ) {
    return this.prisma.user.create({
      data: {
        telegram_id: body.telegram_id,
        username: body.username,
        role: 'USER',
      },
    });
  }

  // Получить всех юзеров (Тест)
  @Get('users')
  async getUsers() {
    return this.prisma.user.findMany();
  }
}
