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
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/db/typeorm/entities/role.entity';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/app/@core/guards/jwt.guard';
import { User } from 'src/db/typeorm/entities/user.entity';

@ApiTags('Users Controller')
@UseGuards(JwtGuard)
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiResponse({
    type: [User],
  })
  getAll(): Promise<User[]> {
    return this.usersService
      .getAll()
      .then((users: User[]) =>
        users.map((user: User) => this.removeSensitiveFields(user)),
      );
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: User,
  })
  getById(@Param('id') id): Promise<User> {
    return this.usersService
      .getById(id)
      .then((user: User) => this.removeSensitiveFields(user));
  }

  @Post()
  @ApiResponse({
    type: User,
  })
  create(@Body() payload: User): Promise<User> {
    return this.usersService
      .create(payload)
      .then((user: User) => this.removeSensitiveFields(user));
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: User,
  })
  update(@Param('id') id, @Body() payload: User): Promise<User> {
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

  private removeSensitiveFields(user: User) {
    if (user?.password !== undefined) {
      delete user.password;
    }

    return user;
  }
}
