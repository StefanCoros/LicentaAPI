import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IncomingMessage } from 'http';

export class JwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(secretOrKey: string) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: any) {
    return {
      email: payload.email,
    };
  }

  private static extractJWT(request: IncomingMessage): string | null {
    const jwt = (request?.headers?.authorization || '').replace('Bearer ', '');

    return jwt || null;
  }
}
