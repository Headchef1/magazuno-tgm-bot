import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 1. ИСПОЛЬЗУЕТСЯ В КОНТРОЛЛЕРЕ (GET /users/me)
  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        shop: true,
      },
    });
  }

  // 2. ИСПОЛЬЗУЕТСЯ В AUTH SERVICE (При входе)
  async findOrCreate(telegramId: string, username?: string): Promise<User> {
    return this.prisma.user.upsert({
      // Используем telegram_id, так как Prisma Client сгенерирован под это поле
      where: { telegramId: telegramId },
      update: {
        username: username,
      },
      create: {
        telegramId: telegramId,
        username: username,
      },
    });
  }
}
