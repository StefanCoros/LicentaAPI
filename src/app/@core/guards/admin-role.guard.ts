import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { User } from 'src/db/typeorm/entities/user.entity';
import { DataSource } from 'typeorm';
import { RolesEnum } from '../models/enums/roles.enum';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private dataSource: DataSource) {}

  async canActivate(context: ExecutionContext) {
    const jwt = (
      (context.getArgByIndex(0) as IncomingMessage)?.headers?.authorization ||
      ''
    ).replace('Bearer ', '');

    if (jwt) {
      return await this.dataSource
        .getRepository(User)
        .findOneBy({
          jwt,
        })
        .then((user: User) => {
          return user.role === RolesEnum.Admin;
        });
    }

    return false;
  }
}
