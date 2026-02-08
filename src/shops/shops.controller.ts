import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
// Используем тот же гард, что и в Users
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createShopDto: CreateShopDto) {
    // req.user.id берется из JWT токена
    return this.shopsService.create(req.user.id, createShopDto);
  }
}
