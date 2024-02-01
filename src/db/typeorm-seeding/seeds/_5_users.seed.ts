import { Connection, EntityManager } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../typeorm/entities/user.entity';
import { RolesEnum } from '../../../app/@core/models/enums/roles.enum';
import * as crypto from 'crypto';
import { Technology } from '../../typeorm/entities/technology.entity';
import { City } from '../../typeorm/entities/city.entity';
import { DEFAULT_CITIES } from '../models/default-cities.model';
import { Role } from '../../typeorm/entities/role.entity';

export class UsersSeed implements Seeder {
  private dataList: {
    firstName: string;
    lastName: string;
    email: string;
    role: RolesEnum;
    roleId: number | undefined;
    password: string;
  }[] = [];

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
        roleId: undefined,
        password: defaultUserPassword,
      },
      {
        firstName: 'User',
        lastName: RolesEnum.Standard,
        email: `${RolesEnum.Standard.toLowerCase()}@it-tracker.com`,
        role: RolesEnum.Standard,
        roleId: undefined,
        password: defaultUserPassword,
      },
      {
        firstName: 'User',
        lastName: RolesEnum.Premium,
        email: `${RolesEnum.Premium.toLowerCase()}@it-tracker.com`,
        role: RolesEnum.Premium,
        roleId: undefined,
        password: defaultUserPassword,
      },
    ];
  }

  async run(factory: Factory, connection: Connection): Promise<void> {
    await connection.transaction(async (entityManager: EntityManager) => {
      for (const data of this.dataList) {
        data.roleId =
          (
            await entityManager.getRepository(Role).findOneBy({
              role: data.role || '',
            })
          )?.id || undefined;

        if (data?.email && data.roleId) {
          const existingUser = await entityManager.getRepository(User).findOne({
            where: { email: data.email || '' },
            relations: ['technologies', 'cities'],
          });

          if (!existingUser) {
            const { role, ...userData } = data;

            const newUser = await entityManager.save(
              entityManager.create<User>(User, userData),
            );
            await this.addDefaultTechnologies(entityManager, newUser);
            await this.addDefaultCities(entityManager, newUser);
          } else {
            await this.addDefaultTechnologies(entityManager, existingUser);
            await this.addDefaultCities(entityManager, existingUser);
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
          name: technology || '',
        });

      if (technologyEntity) {
        if (!user.technologies.includes(technologyEntity)) {
          user.technologies.push(technologyEntity);
        }
      }
    }

    return entityManager.save(user);
  }

  private async addDefaultCities(entityManager: EntityManager, user: User) {
    const defaultCities = DEFAULT_CITIES;

    for (const defaultCity of defaultCities) {
      const cityEntity = await entityManager.getRepository(City).findOneBy({
        name: defaultCity.name || '',
      });

      if (cityEntity) {
        if (!user.cities.includes(cityEntity)) {
          user.cities.push(cityEntity);
        }
      }
    }

    return entityManager.save(user);
  }
}
