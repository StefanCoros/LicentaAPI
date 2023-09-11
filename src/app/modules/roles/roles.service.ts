import { Injectable } from '@nestjs/common';
import { Role } from 'src/db/typeorm/entities/role.entity';
import { DataSource } from 'typeorm';
import { PutRoleRequestModel } from './models/put-role-request.model';
import { GetRoleResponseModel } from './models/get-role-response.model';
import { PostRoleRequestModel } from './models/post-role-request.model';

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

  async deleteById(id: number): Promise<any> {
    const role: Role = await this.dataSource
      .getRepository(Role)
      .findOneByOrFail({
        id: id,
      });

    return !!this.dataSource.getRepository(Role).remove(role);
  }
}
