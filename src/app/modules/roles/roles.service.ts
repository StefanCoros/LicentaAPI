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
      id,
    });
  }

  async create(payload: PostRoleRequestModel): Promise<Role> {
    const role = new Role();

    role.role = payload.role;

    return this.dataSource.getRepository(Role).save(role);
  }

  async updateById(id: number, payload: PutRoleRequestModel): Promise<Role> {
    const role = await this.dataSource.getRepository(Role).findOneByOrFail({
      id,
    });

    role.role = payload.role;

    return this.dataSource.getRepository(Role).save(role);
  }

  async deleteById(id: number): Promise<boolean> {
    const role: Role = await this.dataSource.getRepository(Role).findOneOrFail({
      where: {
        id,
      },
      relations: ['users'],
    });

    if (role?.users?.length > 0) {
      throw new ApiError(
        'Role cannot be deleted. Some users have assigned this role.',
      );
    }

    return !!(await this.dataSource.getRepository(Role).remove(role));
  }
}
