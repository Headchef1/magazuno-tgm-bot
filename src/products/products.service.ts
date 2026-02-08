import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createProductDto: CreateProductDto) {
    // 1. Ищем магазин, принадлежащий этому пользователю
    const shop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
    });

    if (!shop) {
      throw new BadRequestException('You need to create a shop first');
    }

    // 2. Создаем товар
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        shopId: shop.id,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        shop: true, // Подгрузить продавца
        category: true, // Подгрузить категорию
      },
      orderBy: { createdAt: 'desc' }, // Свежие сверху
    });
  }
}
