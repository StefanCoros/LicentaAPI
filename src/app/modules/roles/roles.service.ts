import { Injectable } from '@nestjs/common';
import { Role } from 'src/db/typeorm/entities/role.entity';
import { DataSource } from 'typeorm';
import { PutRoleRequestModel } from './models/put-role-request.model';
import { PostRoleRequestModel } from './models/post-role-request.model';
import { ApiError } from 'src/app/@core/models/api-error.model';

@Injectable()
export class RolesService {
  constructor(private dataSource: DataSource) {}

  getAll(): Promise<Role[]> {
    return this.dataSource.getRepository(Role).find();
  }

  getById(id: number): Promise<Role | null> {
    return this.dataSource.getRepository(Role).findOneBy({
      id: id || 0,
    });
  }

  async create(payload: PostRoleRequestModel): Promise<Role> {
    const role = new Role();

    role.role = payload.role;

    return this.dataSource.getRepository(Role).save(role);
  }

  async updateById(id: number, payload: PutRoleRequestModel): Promise<Role> {
    const role = await this.dataSource.getRepository(Role).findOneByOrFail({
      id: id || 0,
    });

    role.role = payload.role;

    return this.dataSource.getRepository(Role).save(role);
  }

  async deleteById(id: number): Promise<boolean> {
    const role: Role = await this.dataSource.getRepository(Role).findOneOrFail({
      where: {
        id: id || 0,
      },
      relations: ['users'],
    });

    if (role?.users?.length > 0) {
      throw new ApiError(
        403,
        'Rolul nu poate fi şters. Unii utilizatori au acest rol asignat.',
      );
    }

    return !!(await this.dataSource.getRepository(Role).remove(role));
  }
}
