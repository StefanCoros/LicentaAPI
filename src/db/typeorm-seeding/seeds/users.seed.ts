import { Connection, EntityManager } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../typeorm/entities/user.entity';
import { RolesEnum } from '../../../app/@core/models/enums/roles.enum';
import * as crypto from 'crypto';
import { Technology } from '../../typeorm/entities/technology.entity';

export class UsersSeed implements Seeder {
  private dataList = [];

  constructor() {
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

    this.dataList = [
      {
        firstName: 'User',
        lastName: RolesEnum.Admin,
        email: `${RolesEnum.Admin.toLowerCase()}@it-tracker.com`,
        role: RolesEnum.Admin,
        password: defaultUserPassword,
      },
      {
        firstName: 'User',
        lastName: RolesEnum.Standard,
        email: `${RolesEnum.Standard.toLowerCase()}@it-tracker.com`,
        role: RolesEnum.Standard,
        password: defaultUserPassword,
      },
      {
        firstName: 'User',
        lastName: RolesEnum.Premium,
        email: `${RolesEnum.Premium.toLowerCase()}@it-tracker.com`,
        role: RolesEnum.Premium,
        password: defaultUserPassword,
      },
    ];
  }

  async run(factory: Factory, connection: Connection): Promise<void> {
    await connection.transaction(async (entityManager: EntityManager) => {
      for (const data of this.dataList) {
        if (data?.email) {
          const existingUser = await entityManager.getRepository(User).findOne({
            where: { email: data.email },
            relations: ['technologies'],
          });

          if (!existingUser) {
            const newUser = await entityManager.save(
              entityManager.create<User>(User, data),
            );
            await this.addDefaultTechnologies(entityManager, newUser);
          } else {
            await this.addDefaultTechnologies(entityManager, existingUser);
          }
        }
      }
    });
  }

  private async addDefaultTechnologies(
    entityManager: EntityManager,
    user: User,
  ) {
    for (const technology of ['React', 'Angular', 'NodeJS', 'JavaScript']) {
      const technologyEntity = await entityManager
        .getRepository(Technology)
        .findOneBy({
          name: technology,
        });

      if (technologyEntity) {
        if (!user.technologies.includes(technologyEntity)) {
          user.technologies.push(technologyEntity);
        }
      }
    }

    return entityManager.save(user);
  }
}
