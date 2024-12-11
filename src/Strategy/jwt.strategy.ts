import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts the token from the Bearer token in the header
      secretOrKey: process.env.MY_JWT_SECRET, // Ensure the secret key is correct
    });
  }

  async validate(payload: any) {
    // Ensure the payload contains id and role fields
    return { userId: payload.id, role: payload.role }; // Attach id and role to request.user
  }
}
