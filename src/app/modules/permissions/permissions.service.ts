import { Injectable } from '@nestjs/common';
import { RolesEnum } from 'src/app/@core/models/enums/roles.enum';
import { User } from 'src/db/typeorm/entities/user.entity';
import { DataSource } from 'typeorm';
import { PermissionsEnum } from './models/enums/permissions.enum';

@Injectable()
export class PermissionsService {
  constructor(private dataSource: DataSource) {}

  async getAllForCurrentUser(
    currentUserEmail: string,
  ): Promise<PermissionsEnum[]> {
    let result: PermissionsEnum[] = [];

    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: currentUserEmail || '',
      },
      relations: ['role'],
    });

    if (user) {
      result = this.getPermissionsByRole(user.role?.role as RolesEnum);
    }

    return result;
  }

  getPermissionsByRole(role: RolesEnum): PermissionsEnum[] {
    switch (role) {
      case RolesEnum.Admin:
        return [
          PermissionsEnum.jobMarket,
          PermissionsEnum.marketAnalysis,
          PermissionsEnum.technologies,
          PermissionsEnum.cities,
          PermissionsEnum.settings,
        ];
      case RolesEnum.Premium:
        return [
          PermissionsEnum.jobMarket,
          PermissionsEnum.marketAnalysis,
          PermissionsEnum.technologies,
          PermissionsEnum.cities,
        ];
      case RolesEnum.Standard:
        return [PermissionsEnum.jobMarket, PermissionsEnum.marketAnalysis];
      default:
        return [];
    }
  }
}
