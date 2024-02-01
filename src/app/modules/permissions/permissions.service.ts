import { Injectable } from '@nestjs/common';
import { User } from 'src/db/typeorm/entities/user.entity';
import { DataSource } from 'typeorm';
import { PermissionsEnum } from './models/enums/permissions.enum';
import { Permission } from 'src/db/typeorm/entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(private dataSource: DataSource) {}

  async getAllForCurrentUser(
    currentUserEmail: string,
  ): Promise<PermissionsEnum[]> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: currentUserEmail || '',
      },
      relations: ['role', 'role.permissions'],
    });

    return (
      user?.role?.permissions.map(
        (permission: Permission) => permission.permission as PermissionsEnum,
      ) || []
    );
  }
}
