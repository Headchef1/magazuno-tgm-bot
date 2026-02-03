import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('telegram')
  @HttpCode(HttpStatus.OK)
  async telegramLogin(@Body('initData') initData: string) {
    // Фронтенд должен слать JSON: { "initData": "query_id=..." }
    return this.authService.login(initData);
  }
}
