import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/db/typeorm/entities/user.entity';
import { DataSource, EntityManager, In } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Request } from 'express';
import { PostRegisterRequestModel } from './models/post-register-request.model';
import { RolesEnum } from 'src/app/@core/models/enums/roles.enum';
import { PostForgotPasswordRequestModel } from './models/post-forgot-password-request.model';
import { EmailService } from '../../@core/services/email.service';
import { PostResetPasswordRequestModel } from './models/post-reset-password-request.model';
import { Role } from 'src/db/typeorm/entities/role.entity';
import { Technology } from 'src/db/typeorm/entities/technology.entity';
import { DEFAULT_CITIES } from 'src/db/typeorm-seeding/models/default-cities.model';
import { City } from 'src/db/typeorm/entities/city.entity';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: email || '',
      },
      relations: ['role'],
    });

    if (password?.length) {
      password = crypto.createHash('sha256').update(password).digest('hex');
    }

    if (user) {
      if (password === user.password) {
        // @ts-ignore ignore as it overlycomplicates things to check typings
        delete user.password;

        return user;
      }
    }

    return null;
  }

  async login(user: Partial<User>) {
    const userResponse = {
      email: user.email,
      role: user.role,
    };

    const userEntity = await this.dataSource
      .getRepository(User)
      .findOneByOrFail({
        email: user.email || '',
      });

    const jwt = this.jwtService.sign(userResponse);

    userEntity.jwt = jwt;

    await this.dataSource.getRepository(User).save(userEntity);

    return {
      user: userResponse,
      jwt,
    };
  }

  async logout(request: Request) {
    const jwt = (request?.headers?.authorization || '').replace('Bearer ', '');

    if (jwt) {
      try {
        const user = await this.dataSource.getRepository(User).findOneByOrFail({
          jwt: jwt || '',
        });

        user.jwt = null;

        await this.dataSource.getRepository(User).save(user);

        return true;
      } catch (error: any) {
        console.log(error?.message || error);
      }
    }

    return false;
  }

  async register(payload: PostRegisterRequestModel) {
    return this.dataSource.transaction(async (entityManager) => {
      let user = await entityManager.getRepository(User).findOneBy({
        email: payload.email || '',
      });

      if (user) {
        throw new ForbiddenException('User already exists');
      }

      user = new User();

      user.firstName = payload.firstName;
      user.lastName = payload.lastName;
      user.email = payload.email;
      user.password = crypto
        .createHash('sha256')
        .update(payload.password)
        .digest('hex');

      const role = await entityManager.getRepository(Role).findOneBy({
        role: RolesEnum.Premium || '',
      });

      if (!role) {
        throw new Error('Premium role not found.');
      }

      user.role = role;

      await this.addDefaultTechnologies(entityManager, user);
      await this.addDefaultCities(entityManager, user);

      return entityManager.getRepository(User).save(user);
    });
  }

  async forgotPassword(
    request: Request,
    payload: PostForgotPasswordRequestModel,
  ) {
    let link = request?.headers?.origin;

    if (link) {
      const user = await this.dataSource.getRepository(User).findOneBy({
        email: payload.email || '',
      });

      if (user) {
        const resetPasswordToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordTokenExpiredAt = new Date(
          new Date().getTime() + 60 * 60 * 1000, // 1 hour
        );

        await this.dataSource.getRepository(User).save(user);

        link +=
          (link.endsWith('/') ? '' : '/') +
          'reset-password?reset_password_token=' +
          resetPasswordToken;
        this.emailService.sendForgotPasswordEmail(payload, link);
      }
    } else {
      return new NotFoundException('Could not determine the origin');
    }
  }

  async resetPassword(payload: PostResetPasswordRequestModel) {
    if (
      typeof payload.password === 'string' &&
      payload.password?.length &&
      typeof payload.resetPasswordToken === 'string' &&
      payload.resetPasswordToken?.length &&
      payload.password === payload.confirmPassword
    ) {
      const user = await this.dataSource.getRepository(User).findOneBy({
        resetPasswordToken: payload.resetPasswordToken || '',
      });

      if (user && user?.resetPasswordTokenExpiredAt instanceof Date) {
        // password is not expired
        if (new Date() < user.resetPasswordTokenExpiredAt) {
          user.password = crypto
            .createHash('sha256')
            .update(payload.password)
            .digest('hex');
          user.resetPasswordToken = null;
          user.resetPasswordTokenExpiredAt = null;

          await this.dataSource.getRepository(User).save(user);

          return true;
        }
      }
    }

    return new BadRequestException();
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
}
