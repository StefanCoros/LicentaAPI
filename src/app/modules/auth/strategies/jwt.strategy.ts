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
    const cookies = JwtStrategy.parseCookies(request);

    if (cookies && 'accessJwt' in cookies) {
      return cookies.accessJwt.toString();
    }

    return null;
  }

  private static parseCookies(request: IncomingMessage) {
    const list = {};
    const cookieHeader = request.headers?.cookie;

    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function (cookie) {
      let [name, ...rest] = cookie.split(`=`);
      name = name?.trim();
      if (!name) return;
      const value = rest.join(`=`).trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
    });

    return list;
  }
}
