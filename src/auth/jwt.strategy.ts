import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey', // Обязательно добавьте JWT_SECRET в .env
    });
  }

  async validate(payload: any) {
    // Этот объект будет доступен как req.user в контроллерах
    return {
      userId: payload.sub,
      telegramId: payload.tg_id,
      role: payload.role,
    };
  }
}
