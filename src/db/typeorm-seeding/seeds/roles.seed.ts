import { Connection, EntityManager } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Role } from '../../typeorm/entities/role.entity';
import { RoleEnum } from '../../../app/@core/models/role.enum';

export class RolesSeed implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await connection.transaction((entityManager: EntityManager) => {
      return entityManager.save([
        entityManager.create<Role>(Role, {
          role: RoleEnum.Standard,
        }),
        entityManager.create<Role>(Role, {
          role: RoleEnum.Premium,
        }),
      ]);
    });
  }
}
