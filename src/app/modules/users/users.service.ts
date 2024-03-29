import { Injectable } from '@nestjs/common';
import { User } from 'src/db/typeorm/entities/user.entity';
import { DataSource, EntityManager, In } from 'typeorm';
import { PostUserRequestModel } from './models/post-user-request.model';
import { PutUserRequestModel } from './models/put-user-request.model';
import * as crypto from 'crypto';
import { Role } from 'src/db/typeorm/entities/role.entity';
import { ApiError } from 'src/app/@core/models/api-error.model';
import { EmailService } from 'src/app/@core/services/email.service';
import { DEFAULT_CITIES } from 'src/db/typeorm-seeding/models/default-cities.model';
import { City } from 'src/db/typeorm/entities/city.entity';
import { Technology } from 'src/db/typeorm/entities/technology.entity';
import { RolesEnum } from 'src/app/@core/models/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    private dataSource: DataSource,
    private emailService: EmailService,
  ) {}

  getAll(): Promise<User[]> {
    return this.dataSource
      .getRepository(User)
      .find({
        relations: ['role'],
      })
      .then((users: User[]) =>
        users.map((user: User) => this.extractRoleNameFromUser(user)),
      );
  }

  getById(id: number): Promise<User | null> {
    return this.dataSource
      .getRepository(User)
      .findOne({
        where: {
          id: id || 0,
        },
        relations: ['role'],
      })
      .then((user: User) => this.extractRoleNameFromUser(user));
  }

  async create(payload: PostUserRequestModel): Promise<User> {
    return this.dataSource.transaction(async (entityManager: EntityManager) => {
      const password = this.generatePaswsord();

      const userExists = await entityManager.getRepository(User).findOneBy({
        email: payload.email || '',
      });

      if (userExists) {
        throw new ApiError(400, 'Un utilizator cu acest email deja exist&#259;.');
      }

      const user = new User();

      user.firstName = payload.firstName;
      user.lastName = payload.lastName;
      user.email = payload.email;
      user.password = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');

      const role = await entityManager.getRepository(Role).findOneBy({
        role: payload.role || '',
      });

      if (!role) {
        throw new ApiError(400, 'Rolul nu a fost g&#259;sit.');
      }

      user.role = role;

      await this.addDefaultCities(entityManager, user);
      await this.addDefaultTechnologies(entityManager, user);

      try {
        let result = await entityManager
          .getRepository(User)
          .save(user)
          .then((user: User) => this.extractRoleNameFromUser(user));

        try {
          await this.sendInitialEmail(result, password);
        } catch (error: any) {
          await entityManager.getRepository(User);

          throw new ApiError(500, 'Nu am putut trimite emailul de confirmare');
        }

        return result;
      } catch (error: any) {
        if (error instanceof ApiError) {
          throw error;
        } else {
          throw new ApiError(500);
        }
      }
    });
  }

  async updateById(id: number, payload: PutUserRequestModel): Promise<User> {
    const user = await this.dataSource.getRepository(User).findOneOrFail({
      where: {
        id: id || 0,
      },
      relations: ['role'],
    });

    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.email = payload.email;

    if (user.role?.role === RolesEnum.Admin) {
      if (payload.role !== RolesEnum.Admin) {
        const adminCounts = (await this.getAdminCounts()) - 1;

        // check if there are other admins
        if (adminCounts === 0) {
          throw new ApiError(
            403,
            'Nu se poate actualiza utilizatorul selectat.',
          );
        }
      }
    } else {
      const role = await this.dataSource.getRepository(Role).findOneBy({
        role: payload.role || '',
      });

      if (!role) {
        throw new ApiError(403, 'Rolul nu a fost g&#259;sit.');
      }

      user.role = role;
    }

    return this.dataSource
      .getRepository(User)
      .save(user)
      .then((user: User) => this.extractRoleNameFromUser(user));
  }

  async deleteById(id: number): Promise<any> {
    const user: User = await this.dataSource.getRepository(User).findOneOrFail({
      where: {
        id: id || 0,
      },
      relations: ['role'],
    });

    if (user.role?.role === RolesEnum.Admin) {
      const adminCounts = (await this.getAdminCounts()) - 1;

      // check if there are other admins
      if (adminCounts === 0) {
        throw new ApiError(403, 'Nu se poate sterge utilizatorul selectat.');
      }
    }

    return !!(await this.dataSource.getRepository(User).remove(user));
  }

  private generatePaswsord() {
    return crypto.randomBytes(8).toString('hex');
  }

  private sendInitialEmail(user: User, password: string) {
    return this.emailService.sendRegistrationConfirmationEmail(user, password);
  }

  private extractRoleNameFromUser(user: User) {
    // @ts-ignore
    user.role = user?.role?.role || null;

    return user;
  }

  private async addDefaultTechnologies(
    entityManager: EntityManager,
    user: User,
  ) {
    user.technologies =
      (await entityManager.getRepository(Technology).findBy({
        name: In(['JavaScript', 'React', 'Java']),
      })) || [];

    return user;
  }

  private async addDefaultCities(entityManager: EntityManager, user: User) {
    user.cities =
      (await entityManager.getRepository(City).findBy({
        name: In([DEFAULT_CITIES.map((city) => city.name)]),
      })) || [];

    return user;
  }

  private async getAdminCounts() {
    return (
      await this.dataSource.getRepository(User).findBy({
        role: {
          role: RolesEnum.Admin,
        },
      })
    ).length;
  }
}
