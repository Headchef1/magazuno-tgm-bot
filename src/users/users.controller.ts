import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard) // 🔒 Теперь этот эндпоинт защищен
  @Get('me')
  getProfile(@Req() req) {
    return req.user; // Вернет payload из JWT (userId, role...)
  }
}
