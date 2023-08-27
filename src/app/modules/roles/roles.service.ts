import { Injectable } from '@nestjs/common';
import { Role } from 'src/db/typeorm/entities/role.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(private dataSource: DataSource) {}

  getAll(): Promise<Role[]> {
    return this.dataSource.getRepository(Role).find();
  }

  getById(id: number): Promise<Role> {
    return this.dataSource.getRepository(Role).findOneBy({
      id,
    });
  }

  async create(payload: Partial<Role>): Promise<Role> {
    return this.dataSource.getRepository(Role).save(payload);
  }

  async updateById(id: number, payload: Partial<Role>): Promise<Role> {
    const role = await this.dataSource.getRepository(Role).findOneByOrFail({
      id,
    });

    if (payload.id) {
      delete payload.id;
    }

    if (payload.createdAt) {
      delete payload.createdAt;
    }

    if (payload.updatedAt) {
      delete payload.updatedAt;
    }

    return this.dataSource.getRepository(Role).save({ ...role, ...payload });
  }

  async deleteById(id: number): Promise<any> {
    const role: Role = await this.dataSource
      .getRepository(Role)
      .findOneByOrFail({
        id: id,
      });

    return !!this.dataSource.getRepository(Role).remove(role);
  }
}
