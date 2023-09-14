import { Connection, EntityManager } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../typeorm/entities/user.entity';
import { RolesEnum } from '../../../app/@core/models/enums/roles.enum';
import * as crypto from 'crypto';

export class UsersSeed implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    for (const user of [
      RolesEnum.Admin,
      RolesEnum.Standard,
      RolesEnum.Premium,
    ]) {
      await connection.transaction((entityManager: EntityManager) => {
        if (!process?.env?.DEFAULT_USER_PASSWORD?.length) {
          throw new Error('Unable to seed users');
        }

        const defaultUserPassword = crypto
          .createHash('sha256')
          .update(process.env.DEFAULT_USER_PASSWORD)
          .digest('hex');

        if (!defaultUserPassword?.length) {
          throw new Error('Unable to seed users 2');
        }

        return entityManager.save([
          entityManager.create<User>(User, {
            firstName: 'User',
            lastName: user,
            email: `${user.toLowerCase()}@it-tracker.com`,
            role: user,
            password: defaultUserPassword,
          }),
        ]);
      });
    }
  }
}
