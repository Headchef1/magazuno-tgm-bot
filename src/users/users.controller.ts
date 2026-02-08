import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
// Используем ваш существующий гард, он правильный!
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    // В req.user.id лежит ID из токена.
    // Мы идем в базу, чтобы достать свежие данные + инфо о магазине.
    return this.usersService.findOne(req.user.id);
  }
}
