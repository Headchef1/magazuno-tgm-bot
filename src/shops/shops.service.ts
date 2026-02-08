import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';

@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createShopDto: CreateShopDto) {
    // 1. Проверяем, есть ли уже магазин у этого юзера
    const existingShop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
    });

    if (existingShop) {
      throw new BadRequestException('User already has a shop');
    }

    // 2. Проверяем уникальность slug (ссылки)
    const slugTaken = await this.prisma.shop.findUnique({
      where: { slug: createShopDto.slug },
    });

    if (slugTaken) {
      throw new BadRequestException('Shop with this slug already exists');
    }

    // 3. Создаем
    return this.prisma.shop.create({
      data: {
        ...createShopDto,
        ownerId: userId,
      },
    });
  }
}
