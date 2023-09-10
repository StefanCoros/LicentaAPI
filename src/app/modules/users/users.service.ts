import { Injectable } from '@nestjs/common';
import { Role } from 'src/db/typeorm/entities/role.entity';
import { User } from 'src/db/typeorm/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}

  getAll(): Promise<User[]> {
    return this.dataSource
      .getRepository(User)
      .find();
  }

  getById(id: number): Promise<User> {
    return this.dataSource
      .getRepository(User)
      .findOneBy({
        id,
      });
  }

  async create(payload: Partial<User>): Promise<User> {
    return this.dataSource.getRepository(User).save(payload);
  }

  async updateById(id: number, payload: Partial<User>): Promise<User> {
    const user = await this.dataSource.getRepository(User).findOneByOrFail({
      id,
    });

    if (payload.id) {
      delete payload.id;
    }

    if (payload.password) {
      delete payload.password;
    }

    if (payload.createdAt) {
      delete payload.createdAt;
    }

    if (payload.updatedAt) {
      delete payload.updatedAt;
    }

    return this.dataSource.getRepository(User).save({ ...user, ...payload });
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
