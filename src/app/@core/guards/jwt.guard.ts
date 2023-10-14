import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingMessage } from 'http';
import { User } from 'src/db/typeorm/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class JwtGuard extends AuthGuard('admin-jwt') {
  constructor(private dataSource: DataSource) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const jwt = (
      (context.getArgByIndex(0) as IncomingMessage)?.headers?.authorization ||
      ''
    ).replace('Bearer ', '');

    if (jwt) {
      return this.dataSource.getRepository(User).findOneBy({
        jwt,
      }).then((user: User) => {
        return user !== null;
      });
    }

    return false;
  }
}
