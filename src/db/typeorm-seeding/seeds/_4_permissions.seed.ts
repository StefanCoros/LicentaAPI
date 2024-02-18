import { RolesEnum } from '../../../app/@core/models/enums/roles.enum';
import { PermissionsEnum } from '../../../app/modules/permissions/models/enums/permissions.enum';
import { Permission } from '../../typeorm/entities/permission.entity';
import { Role } from '../../typeorm/entities/role.entity';
import { Connection, DeepPartial, EntityManager } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export class PermissionssSeed implements Seeder {
  private dataList: { role: RolesEnum; permissions: PermissionsEnum[] }[] = [];

  constructor() {
    this.dataList = [
      {
        role: RolesEnum.Admin,
        permissions: [
          PermissionsEnum.jobMarket,
          PermissionsEnum.marketAnalysis,
          PermissionsEnum.technologies,
          PermissionsEnum.cities,
          PermissionsEnum.settings,
        ],
      },
      {
        role: RolesEnum.Premium,
        permissions: [
          PermissionsEnum.jobMarket,
          PermissionsEnum.marketAnalysis,
          PermissionsEnum.technologies,
          PermissionsEnum.cities,
        ],
      },
      {
        role: RolesEnum.Standard,
        permissions: [
          PermissionsEnum.jobMarket,
          PermissionsEnum.marketAnalysis,
        ],
      },
    ];
  }

  async run(factory: Factory, connection: Connection): Promise<void> {
    await connection.transaction(async (entityManager: EntityManager) => {
      for (const data of this.dataList) {
        if (data?.role) {
          const role = await entityManager.getRepository(Role).findOneBy({
            role: data.role || '',
          });

          if (role) {
            role.permissions = [];

            for (const permission of data.permissions) {
              let permissionObject = await entityManager
                .getRepository(Permission)
                .findOneBy({
                  permission: permission || '',
                });

              if (!permissionObject) {
                permissionObject = await entityManager.save(
                  entityManager.create<Permission, DeepPartial<Permission>>(Permission, { permission }),
                );
              }

              role.permissions.push(permissionObject);
            }

            await entityManager.save(role);
          }
        }
      }
    });
  }
}
