import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Убедитесь, что путь верный
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(telegramId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { telegram_id: telegramId },
    });
  }

  // Логика: Если юзер есть - обновим (напр. username), если нет - создадим
  async findOrCreate(telegramId: string, username?: string): Promise<User> {
    return this.prisma.user.upsert({
      where: { telegram_id: telegramId },
      update: {
        username: username,
        // updated_at обновляется автоматически Prisma
      },
      create: {
        telegram_id: telegramId,
        username: username,
      },
    });
  }
}
