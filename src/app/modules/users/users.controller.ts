import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/app/@core/guards/jwt.guard';
import { User } from 'src/db/typeorm/entities/user.entity';
import { GetUserResponseModel } from './models/get-user-response.model';
import { PostUserRequestModel } from './models/post-user-request.model';
import { PutUserRequestModel } from './models/put-user-request.model';
import { AdminRoleGuard } from 'src/app/@core/guards/admin-role.guard';
import { Response } from 'express';
import { RolesEnum } from 'src/app/@core/models/enums/roles.enum';

@ApiTags('Users Controller')
@UseGuards(JwtGuard, AdminRoleGuard)
@ApiBearerAuth()
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiResponse({
    type: [GetUserResponseModel],
  })
  getAll(): Promise<GetUserResponseModel[]> {
    return this.usersService
      .getAll()
      .then((users: User[]) =>
        users.map((user: User) => this.extractFields(user)),
      );
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse({
    type: GetUserResponseModel,
  })
  async getById(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response<GetUserResponseModel>> {
    const numberId = parseInt(id, 10);

    if (!numberId) {
      response.status(400);
    } else {
      const result = await this.usersService
        .getById(numberId)
        .then((user: User) => (user ? this.extractFields(user) : null));

      return response.send(result);
    }

    return response.send();
  }

  @Post()
  @ApiBody({
    type: PostUserRequestModel,
  })
  @ApiResponse({
    type: GetUserResponseModel,
  })
  create(@Body() payload: PostUserRequestModel): Promise<GetUserResponseModel> {
    return this.usersService
      .create(payload)
      .then((user: User) => this.extractFields(user));
  }

  @Put(':id')
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiBody({
    type: PutUserRequestModel,
  })
  @ApiResponse({
    type: GetUserResponseModel,
  })
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() payload: PutUserRequestModel,
  ): Promise<Response<GetUserResponseModel>> {
    const numberId = parseInt(id, 10);

    if (!numberId) {
      response.status(400);
    } else {
      const result = await this.usersService
        .updateById(numberId, payload)
        .then((user: User) => this.extractFields(user));

      return response.send(result);
    }

    return response.send();
  }

  @Delete(':id')
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse({
    type: Boolean,
  })
  async deleteById(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response<GetUserResponseModel>> {
    const numberId = parseInt(id, 10);

    if (!numberId) {
      response.status(400);
    } else {
      const result = await this.usersService.deleteById(numberId);

      return response.send(result);
    }

    return response.send();
  }

  private extractFields(user: User): GetUserResponseModel {
    const result: GetUserResponseModel = new GetUserResponseModel();

    const safeFields: (keyof GetUserResponseModel)[] = [
      'id',
      'firstName',
      'lastName',
      'email',
      'role',
    ];

    for (const key in user) {
      if (
        user.hasOwnProperty(key) &&
        safeFields.includes(key as keyof GetUserResponseModel)
      ) {
        // @ts-ignore ignore as it overlycomplicates things to check typings
        result[key] = user[key];
      }
    }

    return result;
  }
}
