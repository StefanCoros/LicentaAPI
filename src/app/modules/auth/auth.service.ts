import { Injectable } from '@nestjs/common';
import { User } from 'src/db/typeorm/entities/user.entity';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Request } from 'express';

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

  async login(user: User) {
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
}
