import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Валидация данных от Telegram (HMAC-SHA256)
  validateInitData(initData: string): any {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');

    if (!hash) throw new UnauthorizedException('Hash not found');

    urlParams.delete('hash');

    // Сортировка ключей по алфавиту и создание data-check-string
    const paramsList: string[] = [];
    urlParams.forEach((value, key) => paramsList.push(`${key}=${value}`));
    paramsList.sort();
    const dataCheckString = paramsList.join('\n');

    // Создание секретного ключа
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(process.env.TELEGRAM_BOT_TOKEN || '') // Убедитесь, что токен в .env
      .digest();

    // Хеширование строки для проверки
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      throw new UnauthorizedException('Invalid initData signature');
    }

    // Парсим данные пользователя из строки
    const userJson = urlParams.get('user');
    if (!userJson) throw new UnauthorizedException('User data missing');

    return JSON.parse(userJson);
  }

  async login(initData: string) {
    // 1. Валидируем подпись
    const telegramUser = this.validateInitData(initData);

    // 2. Ищем или создаем юзера в БД
    const user = await this.usersService.findOrCreate(
      telegramUser.id.toString(),
      telegramUser.username,
    );

    // 3. Генерируем JWT (Payload: sub=UUID, tg_id=TelegramID, role=Role)
    const payload = { sub: user.id, tg_id: user.telegram_id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
