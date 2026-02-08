import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createProductDto: CreateProductDto) {
    // Передаем ID юзера, сервис сам найдет его магазин
    return this.productsService.create(req.user.id, createProductDto);
  }

  // Публичный метод (без гарда), чтобы все могли смотреть товары
  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}
