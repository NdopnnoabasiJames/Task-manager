import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:process.env.MY_JWT_SECRET, // Use an environment variable here
    });
  }

  async validate(payload: any) {
    return { userId: payload.id, role: payload.role };
  }
}
