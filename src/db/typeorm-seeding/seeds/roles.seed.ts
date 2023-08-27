import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Role } from '../../typeorm/entities/role.entity';
import { RoleEnum } from '../../../app/@core/models/role.enum';

export class RolesSeed implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await Promise.all([
      connection.manager.save([
        connection.manager.create<Role>(Role, {
          role: RoleEnum.Standard,
        }),
        connection.manager.create<Role>(Role, {
          role: RoleEnum.Premium,
        }),
      ]),
    ]);
  }
}
