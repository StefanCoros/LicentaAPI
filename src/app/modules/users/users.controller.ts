import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/app/@core/guards/jwt.guard';
import { User } from 'src/db/typeorm/entities/user.entity';
import { GetUserResponseModel } from './models/get-user-response.model';
import { PostUserRequestModel } from './models/post-user-request.model';
import { PutUserRequestModel } from './models/put-user-request.model';

@ApiTags('Users Controller')
@UseGuards(JwtGuard)
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
        users.map((user: User) => this.removeSensitiveFields(user)),
      );
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: GetUserResponseModel,
  })
  getById(@Param('id') id): Promise<GetUserResponseModel> {
    return this.usersService
      .getById(id)
      .then((user: User) => this.removeSensitiveFields(user));
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
      .then((user: User) => this.removeSensitiveFields(user));
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiBody({
    type: PutUserRequestModel,
  })
  @ApiResponse({
    type: GetUserResponseModel,
  })
  update(
    @Param('id') id,
    @Body() payload: PutUserRequestModel,
  ): Promise<GetUserResponseModel> {
    return this.usersService
      .updateById(id, payload)
      .then((user: User) => this.removeSensitiveFields(user));
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: Boolean,
  })
  deleteById(@Param('id') id: number): any {
    return this.usersService.deleteById(id);
  }

  private removeSensitiveFields(user: User): GetUserResponseModel {
    if (user?.password !== undefined) {
      delete user.password;
    }

    return user as unknown as GetUserResponseModel;
  }
}
