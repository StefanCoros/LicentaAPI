import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'src/db/typeorm/entities/user.entity';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Request } from 'express';
import { PostRegisterRequestModel } from './models/post-register-request.model';
import { RolesEnum } from 'src/app/@core/models/enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(private dataSource: DataSource, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.dataSource.getRepository(User).findOneBy({
      email,
    });

    if (password?.length) {
      password = crypto.createHash('sha256').update(password).digest('hex');
    }

    if (user) {
      if (password === user.password) {
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
        email: user.email,
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
          jwt,
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
    let user = await this.dataSource.getRepository(User).findOneBy({
      email: payload.email,
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
    user.role = RolesEnum.Standard;

    return this.dataSource.getRepository(User).save(user);
  }
}
