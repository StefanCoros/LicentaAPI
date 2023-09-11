import { Injectable } from '@nestjs/common';
import { User } from 'src/db/typeorm/entities/user.entity';
import { DataSource } from 'typeorm';
import { PostUserRequestModel } from './models/post-user-request.model';
import { PutUserRequestModel } from './models/put-user-request.model';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}

  getAll(): Promise<User[]> {
    return this.dataSource.getRepository(User).find();
  }

  getById(id: number): Promise<User> {
    return this.dataSource.getRepository(User).findOneBy({
      id,
    });
  }

  async create(payload: PostUserRequestModel): Promise<User> {
    const user = new User();

    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.email = payload.email;
    user.password = crypto
      .createHash('sha256')
      .update(payload.password)
      .digest('hex');
    user.role = payload.role;

    return this.dataSource.getRepository(User).save(user);
  }

  async updateById(id: number, payload: PutUserRequestModel): Promise<User> {
    const user = await this.dataSource.getRepository(User).findOneByOrFail({
      id,
    });

    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.email = payload.email;
    user.password = crypto
      .createHash('sha256')
      .update(payload.password)
      .digest('hex');
    user.role = payload.role;

    return this.dataSource.getRepository(User).save(user);
  }

  async deleteById(id: number): Promise<any> {
    const user: User = await this.dataSource
      .getRepository(User)
      .findOneByOrFail({
        id: id,
      });

    return !!this.dataSource.getRepository(User).remove(user);
  }
}
