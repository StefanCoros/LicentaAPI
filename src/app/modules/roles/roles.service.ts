import { Injectable } from '@nestjs/common';
import { Role } from 'src/db/typeorm/entities/role.entity';
import { DataSource } from 'typeorm';
import { PutRoleRequestModel } from './models/put-role-request.model';
import { PostRoleRequestModel } from './models/post-role-request.model';
import { ApiError } from 'src/app/@core/models/api-error.model';
import { Permission } from 'src/db/typeorm/entities/permission.entity';
import { GetRoleResponseModel } from './models/get-role-response.model';

@Injectable()
export class RolesService {
  constructor(private dataSource: DataSource) {}

  getAll(): Promise<GetRoleResponseModel[]> {
    return this.dataSource
      .getRepository(Role)
      .find({
        relations: ['permissions'],
      })
      .then(
        (roles: Role[]) =>
          roles.map((role: Role) => {
            // @ts-ignore
            role.permissions = role.permissions.map((permission: Permission) =>
              this.extractPermissionName(permission),
            );

            return role;
          }) as unknown as GetRoleResponseModel[],
      );
  }

  getById(id: number): Promise<GetRoleResponseModel> {
    return this.dataSource
      .getRepository(Role)
      .findOne({
        where: {
          id: id || 0,
        },
        relations: ['permissions'],
      })
      .then((role: Role) => {
        // @ts-ignore
        role.permissions = role.permissions.map((permission: Permission) =>
          this.extractPermissionName(permission),
        );

        return role as unknown as GetRoleResponseModel;
      });
  }

  async create(payload: PostRoleRequestModel): Promise<GetRoleResponseModel> {
    if (!Array.isArray(payload?.permissions)) {
      throw new ApiError(400, 'Lista de permisiuni nu a fost trimisa.');
    }

    const role = new Role();

    role.role = payload.role;
    role.permissions = await Promise.all(
      payload.permissions.map((permissionString: string) =>
        this.dataSource
          .getRepository(Permission)
          .findOneBy({ permission: permissionString }),
      ),
    ).then(
      (value: (Permission | null)[]) =>
        value.filter(
          (permission: Permission | null) => !!permission,
        ) as Permission[],
    );

    return this.dataSource
      .getRepository(Role)
      .save(role)
      .then((role: Role) => {
        // @ts-ignore
        role.permissions = role.permissions.map((permission: Permission) =>
          this.extractPermissionName(permission),
        );

        return role as unknown as GetRoleResponseModel;
      });
  }

  async updateById(
    id: number,
    payload: PutRoleRequestModel,
  ): Promise<GetRoleResponseModel> {
    if (!Array.isArray(payload?.permissions)) {
      throw new ApiError(400, 'Lista de permisiuni nu a fost trimisa.');
    }

    const role = await this.dataSource.getRepository(Role).findOneByOrFail({
      id: id || 0,
    });

    role.role = payload.role;
    role.permissions = await Promise.all(
      payload.permissions.map((permissionString: string) =>
        this.dataSource
          .getRepository(Permission)
          .findOneBy({ permission: permissionString }),
      ),
    ).then(
      (value: (Permission | null)[]) =>
        value.filter(
          (permission: Permission | null) => !!permission,
        ) as Permission[],
    );

    return this.dataSource
      .getRepository(Role)
      .save(role)
      .then((role: Role) => {
        // @ts-ignore
        role.permissions = role.permissions.map((permission: Permission) =>
          this.extractPermissionName(permission),
        );

        return role as unknown as GetRoleResponseModel;
      });
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
        'Rolul nu poate fi &#351;ters. Unii utilizatori au acest rol asignat.',
      );
    }

    return !!(await this.dataSource.getRepository(Role).remove(role));
  }

  private extractPermissionName(permission: Permission): string {
    return permission?.permission || '';
  }
}
