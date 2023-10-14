import { Injectable } from '@nestjs/common';
import { User } from 'src/db/typeorm/entities/user.entity';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

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

    return {
      user: userResponse,
      accessJwt: this.jwtService.sign(userResponse),
    };
  }
}
