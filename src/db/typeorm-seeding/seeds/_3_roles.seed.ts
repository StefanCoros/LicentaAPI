import { Connection, DeepPartial, EntityManager } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Role } from '../../typeorm/entities/role.entity';
import { RolesEnum } from '../../../app/@core/models/enums/roles.enum';

export class RolesSeed implements Seeder {
  private dataList: { role: RolesEnum }[] = [];

  constructor() {
    this.dataList = [
      {
        role: RolesEnum.Admin,
      },
      {
        role: RolesEnum.Premium,
      },
      {
        role: RolesEnum.Standard,
      },
    ];
  }

  async run(factory: Factory, connection: Connection): Promise<void> {
    await connection.transaction(async (entityManager: EntityManager) => {
      for (const data of this.dataList) {
        if (data?.role) {
          const roleExists = await entityManager.getRepository(Role).findOneBy({
            role: data.role || '',
          });

          if (!roleExists) {
            await entityManager.save([entityManager.create<Role, DeepPartial<Role>>(Role, data)]);
          }
        }
      }
    });
  }
}
