import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/db/typeorm/entities/role.entity';
import { RolesService } from './roles.service';

@ApiTags('Roles Controller')
@Controller('api/roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  @ApiResponse({
    type: [Role],
  })
  getAll(): Promise<Role[]> {
    return this.rolesService.getAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: Role,
  })
  getById(@Param('id') id): Promise<Role> {
    return this.rolesService.getById(id);
  }

  @Post()
  @ApiResponse({
    type: Role,
  })
  create(@Body() payload: Role): Promise<Role> {
    return this.rolesService.create(payload);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: Role,
  })
  update(@Param('id') id, @Body() payload: Role): Promise<Role> {
    return this.rolesService.updateById(id, payload);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: Boolean,
  })
  deleteById(@Param('id') id: number): any {
    return this.rolesService.deleteById(id);
  }
}
